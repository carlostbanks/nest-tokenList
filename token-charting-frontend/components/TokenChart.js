import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TokenChart = ({ tokenData }) => {
  if (!tokenData) return <p>Loading chart...</p>;

  const chartData = {
    labels: tokenData.history.map(entry => new Date(entry.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: `${tokenData.symbol} Price (USD)`,
        data: tokenData.history.map(entry => entry.price),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
      }
    ],
  };

  return <Line data={chartData} />;
};

export default TokenChart;
