// OriginalName: FinanceAnalytics
// ShortName: FinAnaly

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card } from '../ui/card';
import { DollarSign, TrendingUp, TrendingDown, Percent, ShoppingBag } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data
const summaryData = {
  revenue: 125000000,
  expense: 85000000,
  profit: 40000000,
  margin: 32,
  aov: 250000,
};

const trendData = [
  { date: '1 Des', revenue: 4200000, expense: 2800000 },
  { date: '2 Des', revenue: 3800000, expense: 2500000 },
  { date: '3 Des', revenue: 5100000, expense: 3200000 },
  { date: '4 Des', revenue: 4500000, expense: 3000000 },
  { date: '5 Des', revenue: 6200000, expense: 4100000 },
  { date: '6 Des', revenue: 5800000, expense: 3900000 },
  { date: '7 Des', revenue: 4900000, expense: 3300000 },
];

const profitData = [
  { month: 'Jul', profit: 12500000 },
  { month: 'Agt', profit: 15200000 },
  { month: 'Sep', profit: 13800000 },
  { month: 'Okt', profit: 18900000 },
  { month: 'Nov', profit: 16500000 },
  { month: 'Des', profit: 14200000 },
];

const priceTrackData = [
  { date: '1 Nov', sellPrice: 850000, costPrice: 720000 },
  { date: '5 Nov', sellPrice: 850000, costPrice: 720000 },
  { date: '10 Nov', sellPrice: 870000, costPrice: 730000 },
  { date: '15 Nov', sellPrice: 870000, costPrice: 730000 },
  { date: '20 Nov', sellPrice: 890000, costPrice: 750000 },
  { date: '25 Nov', sellPrice: 900000, costPrice: 760000 },
  { date: '30 Nov', sellPrice: 900000, costPrice: 760000 },
];

const productProfitData = [
  { name: 'LCD Samsung A02', sales: 25, profit: 6250000, margin: 35 },
  { name: 'LCD Infinix Hot 10', sales: 18, profit: 4500000, margin: 32 },
  { name: 'IC Charging 1612', sales: 42, profit: 4200000, margin: 28 },
  { name: 'Mic Universal', sales: 35, profit: 2800000, margin: 25 },
  { name: 'Flexibel Vivo Y21', sales: 22, profit: 2200000, margin: 22 },
];

const cashflowData = [
  { month: 'Jul', cashIn: 45000000, cashOut: 32000000 },
  { month: 'Agt', cashIn: 52000000, cashOut: 36000000 },
  { month: 'Sep', cashIn: 48000000, cashOut: 34000000 },
  { month: 'Okt', cashIn: 61000000, cashOut: 42000000 },
  { month: 'Nov', cashIn: 55000000, cashOut: 38000000 },
  { month: 'Des', cashIn: 49000000, cashOut: 35000000 },
];

const formatRupiah = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
};

export function FinAnaly() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="price">Price Tracking</TabsTrigger>
          <TabsTrigger value="profit">Product Profitability</TabsTrigger>
          <TabsTrigger value="cashflow">Cashflow</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Revenue</span>
                <DollarSign className="size-4 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl">{formatRupiah(summaryData.revenue)}</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="size-3" />
                  <span>+12%</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Expense</span>
                <TrendingDown className="size-4 text-red-600" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl">{formatRupiah(summaryData.expense)}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>+8%</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Net Profit</span>
                <DollarSign className="size-4 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl">{formatRupiah(summaryData.profit)}</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="size-3" />
                  <span>+18%</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Profit Margin</span>
                <Percent className="size-4 text-purple-600" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl">{summaryData.margin}%</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="size-3" />
                  <span>+2%</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">AOV</span>
                <ShoppingBag className="size-4 text-orange-600" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl">{formatRupiah(summaryData.aov)}</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="size-3" />
                  <span>+5%</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4">Revenue vs Expense (7 Hari)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `${value / 1000000}jt`} />
                  <Tooltip formatter={(value) => formatRupiah(Number(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue" strokeWidth={2} />
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Expense" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Profit Bulanan</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value / 1000000}jt`} />
                  <Tooltip formatter={(value) => formatRupiah(Number(value))} />
                  <Bar dataKey="profit" fill="#3b82f6" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        {/* Price Tracking Tab */}
        <TabsContent value="price" className="space-y-6">
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="mb-2">Price Tracking</h3>
              <p className="text-sm text-muted-foreground">Pelacakan harga jual dan modal per produk dari waktu ke waktu</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Avg Price 30d</div>
                <div>{formatRupiah(880000)}</div>
              </Card>
              <Card className="p-4 bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Price Deviation</div>
                <div>+5.8%</div>
              </Card>
              <Card className="p-4 bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Peak Price</div>
                <div>{formatRupiah(900000)}</div>
              </Card>
              <Card className="p-4 bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Lowest Price</div>
                <div>{formatRupiah(850000)}</div>
              </Card>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={priceTrackData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip formatter={(value) => formatRupiah(Number(value))} />
                <Legend />
                <Line type="monotone" dataKey="sellPrice" stroke="#10b981" name="Harga Jual" strokeWidth={2} />
                <Line type="monotone" dataKey="costPrice" stroke="#f59e0b" name="Harga Modal" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Product Profitability Tab */}
        <TabsContent value="profit" className="space-y-6">
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="mb-2">Product Profitability</h3>
              <p className="text-sm text-muted-foreground">Produk dengan profit tertinggi</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Produk</th>
                    <th className="text-right p-3">Penjualan</th>
                    <th className="text-right p-3">Total Profit</th>
                    <th className="text-right p-3">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {productProfitData.map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="p-3">{item.name}</td>
                      <td className="text-right p-3">{item.sales}x</td>
                      <td className="text-right p-3">{formatRupiah(item.profit)}</td>
                      <td className="text-right p-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700">
                          {item.margin}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Margin per Product</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productProfitData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="margin" fill="#8b5cf6" name="Margin %" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Cashflow Tab */}
        <TabsContent value="cashflow" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Saldo Awal</div>
              <div className="text-xl">{formatRupiah(25000000)}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Cash In</div>
              <div className="text-xl text-green-600">{formatRupiah(49000000)}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Cash Out</div>
              <div className="text-xl text-red-600">{formatRupiah(35000000)}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Saldo Akhir</div>
              <div className="text-xl">{formatRupiah(39000000)}</div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="mb-4">Cashflow 6 Bulan Terakhir</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={cashflowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value / 1000000}jt`} />
                <Tooltip formatter={(value) => formatRupiah(Number(value))} />
                <Legend />
                <Bar dataKey="cashIn" fill="#10b981" name="Cash In" />
                <Bar dataKey="cashOut" fill="#ef4444" name="Cash Out" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4">Cash In Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span>Penjualan Produk</span>
                  <span>{formatRupiah(38000000)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span>Service & Repair</span>
                  <span>{formatRupiah(8500000)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span>Pelunasan Hutang</span>
                  <span>{formatRupiah(2500000)}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Cash Out Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span>Pembelian Sparepart</span>
                  <span>{formatRupiah(28000000)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span>Expense Operasional</span>
                  <span>{formatRupiah(6000000)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span>Refund & Retur</span>
                  <span>{formatRupiah(1000000)}</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
