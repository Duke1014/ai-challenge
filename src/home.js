import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
// import Papa from 'papaparse';
import FileUpload from './FileUpload';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function Home() {
  const [dataOne, setDataOne] = useState(null);
  const [dataTwo, setDataTwo] = useState(null);
  const [selectedColumnsOne, setSelectedColumnsOne] = useState([]);
  const [selectedColumnsTwo, setSelectedColumnsTwo] = useState([]);
  const [chartData, setChartData] = useState(null);

  const handleColumnSelection = (column, fileIndex, isSelected) => {
    const setSelectedColumns = fileIndex === 1 ? setSelectedColumnsOne : setSelectedColumnsTwo;
    const selectedColumns = fileIndex === 1 ? selectedColumnsOne : selectedColumnsTwo;

    if (isSelected) {
      setSelectedColumns([...selectedColumns, column]);
    } else {
      setSelectedColumns(selectedColumns.filter(col => col !== column));
    }
  };

  const generateChartData = () => {
    if (!selectedColumnsOne.length || !selectedColumnsTwo.length || !dataOne || !dataTwo) return;

    const commonColumn = selectedColumnsOne.find(col => selectedColumnsTwo.includes(col));
    if (!commonColumn) {
      alert("No common column selected between the two files to correlate data.");
      return;
    }

    const combinedData = dataOne
      .filter(row1 => dataTwo.some(row2 => row2[commonColumn] === row1[commonColumn]))
      .map(row1 => ({
        ...row1,
        ...dataTwo.find(row2 => row2[commonColumn] === row1[commonColumn]),
      }));

    setChartData(generateLineChartData(combinedData, selectedColumnsOne, selectedColumnsTwo, commonColumn));
  };

  const generateLineChartData = (combinedData, colsOne, colsTwo, commonColumn) => {
    const labels = combinedData.map(item => item[commonColumn]);

    const datasets = [
      ...colsOne.map(col => ({
        label: `File 1 - ${col}`,
        data: combinedData.map(item => parseFloat(item[col]) || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
      })),
      ...colsTwo.map(col => ({
        label: `File 2 - ${col}`,
        data: combinedData.map(item => parseFloat(item[col]) || 0),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
      })),
    ];

    return { labels, datasets };
  };

  return (
    <div>
      <h1>Upload Two CSV Files to Generate a Correlated Graph</h1>
      <div>
        <FileUpload key={1} setData={setDataOne} />
        <FileUpload key={2} setData={setDataTwo} />
      </div>

      {dataOne && (
        <div>
          <h2>Select Columns from File 1</h2>
          {Object.keys(dataOne[0]).map((col, index) => (
            <label key={index} className='column-select'>
              <input
                type="checkbox"
                onChange={(e) => handleColumnSelection(col, 1, e.target.checked)}
              />
              {col}
              <br />
            </label>
          ))}
        </div>
      )}

      {dataTwo && (
        <div>
          <h2>Select Columns from File 2</h2>
          {Object.keys(dataTwo[0]).map((col, index) => (
            <label key={index}>
              <input
                type="checkbox"
                onChange={(e) => handleColumnSelection(col, 2, e.target.checked)}
              />
              {col}
              <br />
            </label>
          ))}
        </div>
      )}

      <button onClick={generateChartData} style={{ marginTop: '20px' }}>Generate Chart</button>

      {chartData && (
        <div style={{ width: '800px', marginTop: '30px' }}>
          <Line data={chartData} options={{ responsive: true }} />
        </div>
      )}
    </div>
  );
}

export default Home;
