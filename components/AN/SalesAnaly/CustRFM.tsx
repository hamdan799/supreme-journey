// OriginalName: CustomerRFMAnalysis
// ShortName: CustRFM

import { Card } from '../../ui/card';
import { Users, Repeat, TrendingUp } from 'lucide-react';

const formatRupiah = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
};

const topCustomers = [
  { name: 'Budi Santoso', frequency: 12, monetary: 8500000, recency: '2 hari lalu' },
  { name: 'Siti Aminah', frequency: 9, monetary: 6200000, recency: '1 hari lalu' },
  { name: 'Ahmad Fauzi', frequency: 8, monetary: 5800000, recency: '4 hari lalu' },
  { name: 'Rina Susanti', frequency: 7, monetary: 4900000, recency: '3 hari lalu' },
  { name: 'Dedi Kurniawan', frequency: 6, monetary: 4200000, recency: '5 hari lalu' },
];

export function CustRFM() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-blue-100">
            <Users className="size-5 text-blue-600" />
          </div>
          <div>
            <h3>Total Customer</h3>
            <p className="text-2xl">342</p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">New Customer</span>
            <span>48</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Active</span>
            <span>215</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Inactive</span>
            <span>79</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-green-100">
            <Repeat className="size-5 text-green-600" />
          </div>
          <div>
            <h3>Repeat Rate</h3>
            <p className="text-2xl">32%</p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Repeat Customer</span>
            <span>109</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">One-time Only</span>
            <span>233</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Avg per Customer</span>
            <span>2.8 transaksi</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-purple-100">
            <TrendingUp className="size-5 text-purple-600" />
          </div>
          <div>
            <h3>CLV Average</h3>
            <p className="text-2xl">{formatRupiah(1850000)}</p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Top 10% CLV</span>
            <span>{formatRupiah(8500000)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Median CLV</span>
            <span>{formatRupiah(950000)}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 lg:col-span-3">
        <h3 className="mb-4">Top Customers (RFM)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Customer</th>
                <th className="text-center p-3">Frequency</th>
                <th className="text-right p-3">Monetary</th>
                <th className="text-right p-3">Recency</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((cust, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                        {idx + 1}
                      </div>
                      <span>{cust.name}</span>
                    </div>
                  </td>
                  <td className="text-center p-3">{cust.frequency}x</td>
                  <td className="text-right p-3">{formatRupiah(cust.monetary)}</td>
                  <td className="text-right p-3 text-muted-foreground">{cust.recency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
