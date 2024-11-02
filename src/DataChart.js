import React from 'react'
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function DataChart({chartData}) {
  return (
    <div>
        <div style={{ width: '800px', marginTop: '30px' }}>
            <Line data={chartData} options={{ responsive: true }} />
        </div>
    </div>
  )
}
