// OriginalName: CategoryBrandAnalysis
// ShortName: CatBrand

import { Card } from '../../ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const categoryData = [
  { name: 'Sparepart', value: 62, amount: 77500000, growth: 12 },
  { name: 'HP Bekas', value: 28, amount: 35000000, growth: -5 },
  { name: 'Aksesoris', value: 10, amount: 12500000, growth: 8 },
];

const brandData = [
  { brand: 'Samsung', sales: 32000000, growth: 18 },
  { brand: 'Infinix', sales: 28000000, growth: 34 },
  { brand: 'Vivo', sales: 22000000, growth: 8 },
  { brand: 'OPPO', sales: 18000000, growth: -12 },
  { brand: 'Xiaomi', sales: 15000000, growth: 25 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const formatRupiah = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
};

export function CatBrand() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="mb-4">Penjualan per Kategori</h3>
        <div className="grid grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            {categoryData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm">{item.value}%</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatRupiah(item.amount)}</span>
                  <div className={`flex items-center gap-1 ${item.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.growth > 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    <span>{Math.abs(item.growth)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4">Penjualan per Brand</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={brandData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="brand" />
            <YAxis tickFormatter={(value) => `${value / 1000000}jt`} />
            <Tooltip formatter={(value) => formatRupiah(Number(value))} />
            <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {brandData.slice(0, 4).map((item, idx) => (
            <div key={idx} className="p-3 bg-muted/50 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{item.brand}</span>
                <div className={`flex items-center gap-1 text-xs ${item.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.growth > 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                  <span>{Math.abs(item.growth)}%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{formatRupiah(item.sales)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
