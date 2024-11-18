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
        label: '合計スコア',
        data: records.map((record) => (record.score ?? 0) + (record.time_bonus ?? 0)),
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
      },
    },
  };

  return (
    <div className="mb-10">
      <Line data={data} options={options} />
    </div>
  );
}
