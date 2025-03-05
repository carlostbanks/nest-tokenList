import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, CrosshairPlugin } from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  TimeScale
);

export default function TokenChart({ tokenData }) {
  // Check if tokenData and tokenData.history exist
  if (!tokenData || !tokenData.history || tokenData.history.length === 0) {
    return <div className="text-center text-xl text-white">No data available</div>;
  }

  // Sort history by timestamp in descending order (most recent first)
  const sortedHistory = [...tokenData.history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Prepare chart data
  const chartData = {
    labels: sortedHistory.map((price) => new Date(price.timestamp)),
    datasets: [
      {
        label: tokenData.symbol,
        data: sortedHistory.map((price) => price.price),
        borderColor: '#00ff99',
        backgroundColor: 'rgba(0, 255, 153, 0.2)',
        borderWidth: 2,
        pointRadius: 0, // Hide points by default
        pointHoverRadius: 6,
        tension: 0.3, // Smooth curve
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          tooltipFormat: 'PPpp',
          displayFormats: {
            minute: 'HH:mm', // Example: 14:35
            hour: 'HH:mm',
          },
        },
        ticks: {
          maxTicksLimit: 6,
          autoSkip: true,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
          drawOnChartArea: true,
          drawTicks: false,
        },
      },
      y: {
        ticks: {
          callback: (value) => `$${value.toFixed(2)}`, // Show prices as $xx.xx
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
          drawOnChartArea: true,
          drawTicks: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Remove legend
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#00ff99',
        borderWidth: 1,
        callbacks: {
          title: (context) => {
            const date = new Date(context[0].label);
            return date.toLocaleString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit' 
            });
          },
          label: (context) => `Price: $${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    hover: {
      mode: 'nearest',
      intersect: false,
    },
  };

  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px]">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}