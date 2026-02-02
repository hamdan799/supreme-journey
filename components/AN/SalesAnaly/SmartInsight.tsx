// OriginalName: SmartInsightsPanel
// ShortName: SmartInsight

import { Card } from '../../ui/card';
import { Lightbulb, TrendingDown, TrendingUp, AlertTriangle, Target } from 'lucide-react';

const insights = [
  {
    type: 'warning',
    icon: TrendingDown,
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    title: 'Penurunan Penjualan LCD A02',
    description: 'Produk LCD Samsung A02 mengalami penurunan 28% dalam 7 hari terakhir. Kemungkinan kompetitor menurunkan harga.',
  },
  {
    type: 'success',
    icon: TrendingUp,
    color: 'text-green-600',
    bg: 'bg-green-100',
    title: 'Peak Hours Teridentifikasi',
    description: 'Puncak penjualan konsisten terjadi jam 14:00–16:00. Pertimbangkan untuk menambah staff pada jam tersebut.',
  },
  {
    type: 'info',
    icon: Target,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    title: 'Repeat Customer Rendah',
    description: 'Hanya 32% pelanggan yang melakukan pembelian ulang. Peluang besar untuk implementasi program loyalitas.',
  },
  {
    type: 'alert',
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-100',
    title: 'Brand Infinix Meningkat Tajam',
    description: 'Penjualan brand Infinix naik 34% dibanding bulan lalu. Pastikan stok sparepart Infinix mencukupi.',
  },
];

export function SmartInsight() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="size-5 text-yellow-600" />
        <h3>Smart Insights</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Insight otomatis dari AI berdasarkan pola data penjualan Anda
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className={`p-2 h-fit rounded-lg ${insight.bg}`}>
              <insight.icon className={`size-5 ${insight.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="mb-1">{insight.title}</h4>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
