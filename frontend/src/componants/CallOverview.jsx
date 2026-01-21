import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CallOverviewChart = ({ connected, total }) => {
  const percentage = ((connected / total) * 100).toFixed(2);
  const remaining = total - connected;

  const data = {
    labels: ['Connected', 'Remaining'],
    datasets: [
      {
        data: [connected, remaining],
        backgroundColor: ['#6366f1', '#e5e7eb'],
        borderWidth: 0,
        cutout: '80%',
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Call Overview</h3>
      <div className="relative h-48">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-800">{percentage}%</span>
          <span className="text-xs text-gray-500 uppercase font-medium">Connected</span>
        </div>
      </div>
      <div className="flex justify-around mt-6 pt-4 border-t border-gray-50">
        <div className="text-center">
          <p className="text-sm text-gray-500">Connected</p>
          <p className="text-xl font-bold text-indigo-600">{connected}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold text-gray-800">{total}</p>
        </div>
      </div>
    </div>
  );
};

export default CallOverviewChart;