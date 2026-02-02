// OriginalName: SalesTimeSeriesChart
// ShortName: TimeChart

import { useState } from 'react';
import { Card } from '../../ui/card';
import { ToggleGroup, ToggleGroupItem } from '../../ui/toggle-group';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const dailyData = [
  { date: '1 Des', revenue: 4200000, count: 18 },
  { date: '2 Des', revenue: 3800000, count: 15 },
  { date: '3 Des', revenue: 5100000, count: 22 },
  { date: '4 Des', revenue: 4500000, count: 19 },
  { date: '5 Des', revenue: 6200000, count: 26 },
  { date: '6 Des', revenue: 5800000, count: 24 },
  { date: '7 Des', revenue: 4900000, count: 21 },
];

const weeklyData = [
  { date: 'Week 1', revenue: 28500000, count: 125 },
  { date: 'Week 2', revenue: 32100000, count: 142 },
  { date: 'Week 3', revenue: 29800000, count: 131 },
  { date: 'Week 4', revenue: 34600000, count: 148 },
];

const monthlyData = [
  { date: 'Jul', revenue: 98000000, count: 425 },
  { date: 'Agt', revenue: 112000000, count: 487 },
  { date: 'Sep', revenue: 105000000, count: 456 },
  { date: 'Okt', revenue: 125000000, count: 521 },
  { date: 'Nov', revenue: 118000000, count: 498 },
  { date: 'Des', revenue: 89000000, count: 378 },
];

const formatRupiah = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
};

export function TimeChart() {
  const [view, setView] = useState('daily');

  const data = view === 'daily' ? dailyData : view === 'weekly' ? weeklyData : monthlyData;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="mb-1">Grafik Penjualan</h3>
          <p className="text-sm text-muted-foreground">Revenue dan jumlah transaksi dari waktu ke waktu</p>
        </div>
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v)}>
          <ToggleGroupItem value="daily">Harian</ToggleGroupItem>
          <ToggleGroupItem value="weekly">Mingguan</ToggleGroupItem>
          <ToggleGroupItem value="monthly">Bulanan</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis 
            yAxisId="left"
            tickFormatter={(value) => `${value / 1000000}jt`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'revenue') return formatRupiah(Number(value));
              return `${value} transaksi`;
            }}
          />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="revenue" 
            stroke="#10b981" 
            name="Revenue" 
            strokeWidth={2} 
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="count" 
            stroke="#3b82f6" 
            name="Jumlah Transaksi" 
            strokeWidth={2} 
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
