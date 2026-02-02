// OriginalName: TopProductsAnalysis
// ShortName: TopProds

import { Card } from '../../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const topByQty = [
  { name: 'LCD Samsung A02', qty: 28, revenue: 7000000, pct: 18 },
  { name: 'IC Charging 1612', qty: 25, revenue: 2500000, pct: 16 },
  { name: 'LCD Infinix Hot 10', qty: 22, revenue: 5500000, pct: 14 },
  { name: 'Mic Universal', qty: 18, revenue: 1800000, pct: 12 },
  { name: 'Flexibel Vivo Y21', qty: 15, revenue: 1500000, pct: 10 },
];

const topByRevenue = [
  { name: 'LCD Samsung A02', value: 7000000 },
  { name: 'LCD Infinix Hot 10', value: 5500000 },
  { name: 'IC Charging 1612', value: 2500000 },
  { name: 'Mic Universal', value: 1800000 },
  { name: 'Flexibel Vivo Y21', value: 1500000 },
];

const formatRupiah = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
};

export function TopProds() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="mb-4">Top Produk (Berdasarkan Qty)</h3>
        <div className="space-y-3">
          {topByQty.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary text-sm shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="truncate">{item.name}</p>
                  <span className="text-sm ml-2">{item.qty} unit</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all" 
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{item.pct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4">Top Produk (Berdasarkan Revenue)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topByRevenue} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(value) => `${value / 1000000}jt`} />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip formatter={(value) => formatRupiah(Number(value))} />
            <Bar dataKey="value" fill="#10b981" name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
