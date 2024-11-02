import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import FileUpload from './FileUpload';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Home() {
  const [dataOne, setDataOne] = useState(null);
  const [dataTwo, setDataTwo] = useState(null);
  const [selectedColumnsOne, setSelectedColumnsOne] = useState([]);
  const [selectedColumnsTwo, setSelectedColumnsTwo] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [synopsis, setSynopsis] = useState(null);

  const handleColumnSelection = (column, fileIndex, isSelected) => {
    const setSelectedColumns = fileIndex === 1 ? setSelectedColumnsOne : setSelectedColumnsTwo;
    const selectedColumns = fileIndex === 1 ? selectedColumnsOne : selectedColumnsTwo;

    if (isSelected) {
      setSelectedColumns([...selectedColumns, column]);
    } else {
      setSelectedColumns(selectedColumns.filter(col => col !== column));
    }
  };

  const mergeAndGenerateChartData = () => {
    if (!dataOne || !dataTwo) return;

    // Merging logic
    const mergedData = dataOne.map(row1 => {
      const matchingRow = dataTwo.find(row2 => row2[dataOne[0].ID] === row1[dataOne[0].ID]); // Replace 'ID' with the key for matching
      if (matchingRow) {
        return { ...row1, ...matchingRow };
      }
      return row1; // Keep row1 if no match found
    });

    // Prune the merged data based on selected columns
    const prunedData = mergedData.map(row => {
      const newRow = {};
      selectedColumnsOne.forEach(col => { if (row[col]) newRow[col] = row[col]; });
      selectedColumnsTwo.forEach(col => { if (row[col]) newRow[col] = row[col]; });
      return newRow;
    });

    // Generate chart data
    const chartData = generateLineChartData(prunedData);
    setChartData(chartData);

    // Call LLM API for synopsis
    generateSynopsis(chartData);
  };

  const generateLineChartData = (prunedData) => {
    const labels = prunedData.map(item => item[dataOne[0].ID]); // Replace 'ID' with the key for the x-axis label

    const datasets = [
      ...selectedColumnsOne.map(col => ({
        label: `File 1 - ${col}`,
        data: prunedData.map(item => parseFloat(item[col]) || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
      })),
      ...selectedColumnsTwo.map(col => ({
        label: `File 2 - ${col}`,
        data: prunedData.map(item => parseFloat(item[col]) || 0),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
      })),
    ];

    return { labels, datasets };
  };

  const generateSynopsis = async (chartData) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',  // Or 'gpt-4' if available in your API plan
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for generating summaries of chart data.',
            },
            {
              role: 'user',
              content: `Provide a brief summary of the following data:\n${JSON.stringify(chartData)}`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer YOUR_OPENAI_API_KEY`,  // Replace with your actual API key
            'Content-Type': 'application/json',
          },
        }
      );

      setSynopsis(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error generating synopsis:", error);
      setSynopsis("Error generating synopsis.");
    }
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
            <label key={index}>
              <input
                type="checkbox"
                onChange={(e) => handleColumnSelection(col, 1, e.target.checked)}
              />
              {col}
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
            </label>
          ))}
        </div>
      )}

      <button onClick={mergeAndGenerateChartData} style={{ marginTop: '20px' }}>Generate Chart and Synopsis</button>

      {chartData && (
        <div style={{ width: '600px', marginTop: '30px' }}>
          <Line data={chartData} options={{ responsive: true }} />
        </div>
      )}

      {synopsis && (
        <div style={{ marginTop: '20px' }}>
          <h2>Chart Synopsis</h2>
          <p>{synopsis}</p>
        </div>
      )}
    </div>
  );
}

export default Home;
