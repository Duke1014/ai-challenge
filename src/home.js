import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import FileUpload from './FileUpload';

// Register the necessary components with Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Home() {
  const [dataOne, setDataOne] = useState(null)
  const [dataTwo, setDataTwo] = useState(null)
  const [numberOfFiles, setNumberOfFiles] = useState(2)

  // Handler for CSV upload
  // const employeeInfo = {}
  const performanceData = []

  // const processEmployeeInfo = (data) => {
  //     data.forEach((row) => {
  //         employeeInfo[row.EmployeeID] = row
  //     })
  // }

  // const processEmployeePerformance = (data) => {
  //     data.forEach((row) => {
  //         performanceData.push({
  //             EmployeeID: row.EmployeeID,
  //             Month: row.Month,
  //             Sales: parseFloat(row.Sales),
  //         })
  //     })
  //     aggregateAndSetChartData();
  // };

  // const aggregateAndSetChartData = () => {
  //     const months = [...new Set(performanceData.map(d => d.Month))]
  //     const salesByMonth = months.map(month => {
  //         return performanceData.filter(d => d.Month === month).reduce((sum, d) => sum + d.Sales, 0)
  //     }
  // )

  // setChartData({
  //   labels: months,
  //   datasets: [
  //     {
  //       label: 'Total Sales by Month',
  //       data: salesByMonth,
  //       backgroundColor: 'rgba(75, 192, 192, 0.2)',
  //       borderColor: 'rgba(75, 192, 192, 1)',
  //       borderWidth: 1,
  //     },
  //   ],
  // })

  return (
    <div>
      <h1>Upload CSV Files to Generate a Graph</h1>
      <div>
        <FileUpload key={1} setDataOne={setDataOne} />
        <FileUpload key={2} setDataTwo={setDataTwo} />
      </div>
      {/* {chartData && (
        <div style={{ width: '600px', marginTop: '30px' }}>
          <Line data={chartData} options={{ responsive: true }} />
        </div>
      )} */}
    </div>
  );
}
export default Home