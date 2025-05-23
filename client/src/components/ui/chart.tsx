'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
  className?: string;
  timePeriod?: "1D" | "1W" | "1M";
}

// Sample data for different time periods
const dataByPeriod = {
  "1D": [
    { time: '00:00', price: 1.0920 },
    { time: '04:00', price: 1.0925 },
    { time: '08:00', price: 1.0930 },
    { time: '12:00', price: 1.0928 },
    { time: '16:00', price: 1.0924 },
    { time: '20:00', price: 1.0926 },
    { time: '24:00', price: 1.0924 },
  ],
  "1W": [
    { time: 'Mon', price: 1.0920 },
    { time: 'Tue', price: 1.0925 },
    { time: 'Wed', price: 1.0930 },
    { time: 'Thu', price: 1.0928 },
    { time: 'Fri', price: 1.0924 },
    { time: 'Sat', price: 1.0926 },
    { time: 'Sun', price: 1.0924 },
  ],
  "1M": [
    { time: 'Week 1', price: 1.0920 },
    { time: 'Week 2', price: 1.0925 },
    { time: 'Week 3', price: 1.0930 },
    { time: 'Week 4', price: 1.0928 },
  ],
};

export function Chart({ className, timePeriod = "1D" }: ChartProps) {
  const data = dataByPeriod[timePeriod];

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={{ stroke: '#374151' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
            axisLine={{ stroke: '#374151' }}
            domain={['dataMin - 0.001', 'dataMax + 0.001']}
            tickFormatter={(value) => value.toFixed(4)}
            width={60}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
              color: '#F3F4F6'
            }}
            labelStyle={{ color: '#9CA3AF' }}
            formatter={(value: number) => [value.toFixed(4), 'Price']}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#3B82F6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 