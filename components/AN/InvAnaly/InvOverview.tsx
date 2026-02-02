// OriginalName: InventoryOverview
// ShortName: InvOverview

import { Card } from '../../ui/card';
import { Package, TrendingDown, AlertTriangle, Archive, ArrowDown, ArrowUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const formatRupiah = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
};

const distributionData = [
  { name: 'Produk', value: 35, count: 145 },
  { name: 'Sparepart', value: 58, count: 892 },
  { name: 'Brandless', value: 7, count: 68 },
];

const movementData = [
  { date: '1 Des', in: 42, out: 38 },
  { date: '2 Des', in: 35, out: 45 },
  { date: '3 Des', in: 48, out: 52 },
  { date: '4 Des', in: 38, out: 41 },
  { date: '5 Des', in: 55, out: 48 },
  { date: '6 Des', in: 42, out: 50 },
  { date: '7 Des', in: 38, out: 44 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

export function InvOverview() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Nilai Stok</span>
            <Package className="size-4 text-blue-600" />
          </div>
          <p className="text-2xl">{formatRupiah(285000000)}</p>
          <p className="text-xs text-muted-foreground mt-1">1,105 items</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Low Stock</span>
            <TrendingDown className="size-4 text-orange-600" />
          </div>
          <p className="text-2xl">24</p>
          <p className="text-xs text-orange-600 mt-1">Perlu restok segera</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Dead Stock</span>
            <Archive className="size-4 text-red-600" />
          </div>
          <p className="text-2xl">12</p>
          <p className="text-xs text-muted-foreground mt-1">{formatRupiah(8500000)}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Stok Bergerak</span>
            <AlertTriangle className="size-4 text-green-600" />
          </div>
          <p className="text-2xl">892</p>
          <p className="text-xs text-green-600 mt-1">Perputaran sehat</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="mb-4">Distribusi Inventory</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {distributionData.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.name}</span>
                <span>{item.count} items</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="mb-4">Pergerakan Stok (7 Hari)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={movementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="in" fill="#10b981" name="Stok Masuk" />
              <Bar dataKey="out" fill="#ef4444" name="Stok Keluar" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4">Brand Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Pergerakan Tertinggi</span>
              <ArrowUp className="size-4 text-green-600" />
            </div>
            <p className="text-lg">Samsung</p>
            <p className="text-xs text-muted-foreground">145 transaksi bulan ini</p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Low Stock Terbanyak</span>
              <AlertTriangle className="size-4 text-orange-600" />
            </div>
            <p className="text-lg">Infinix</p>
            <p className="text-xs text-muted-foreground">8 items low stock</p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Dead Stock Terbanyak</span>
              <ArrowDown className="size-4 text-red-600" />
            </div>
            <p className="text-lg">OPPO</p>
            <p className="text-xs text-muted-foreground">5 items tidak bergerak</p>
          </div>
        </div>
      </Card>
    </>
  );
}
