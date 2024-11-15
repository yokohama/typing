import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { RecordsProps } from '@/types/result';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const Records: React.FC<RecordsProps> = ({ records }) => {
  const data = {
    labels: records.map((_, index) => index + 1),
    datasets: [
      {
        label: 'Score',
        data: records.map((record) => record.score + record.time_bonus),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Scores Over Time',
      },
    },
  };

  return <Line data={data} options={options} />;
}
