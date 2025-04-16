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
  Filler,
} from 'chart.js';

import { RecordsProps } from '@/types/result';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export const Chart: React.FC<RecordsProps> = ({ records }) => {
  const data = {
    labels: records.map((_, index) => index + 1),
    datasets: [
      {
        label: '合計スコア',
        data: records.map((record) => (record.score ?? 0)),
        borderColor: 'rgba(244, 114, 182, 0.4)',
        backgroundColor: 'rgb(244, 114, 182)',
        fill: false
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
