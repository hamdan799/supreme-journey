// OriginalName: BusinessInsightsEngine
// ShortName: Insights

import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Lightbulb, TrendingUp, AlertTriangle, Target, Zap, Package, Users, DollarSign } from 'lucide-react';

const insights = [
  {
    category: 'inventory',
    icon: Package,
    priority: 'high',
    color: 'text-red-600',
    bg: 'bg-red-100',
    title: 'LCD Vivo Y21 Paling Laku Minggu Ini',
    description: 'LCD Vivo Y21 terjual 18 unit dalam 7 hari terakhir, naik 45% dari minggu sebelumnya.',
    recommendation: 'Naikkan stok minimal +5 unit untuk mengantisipasi permintaan.',
    impact: 'High',
    actionable: true,
  },
  {
    category: 'quality',
    icon: AlertTriangle,
    priority: 'critical',
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    title: 'Repeat Service Mic Infinix Hot 10 Tinggi',
    description: 'Repeat service untuk masalah mic Infinix Hot 10 mencapai 70%. Root cause: jalur mic upper board, bukan sparepart.',
    recommendation: 'Tampilkan alert khusus saat handle kasus Infinix Hot 10 mic problem. Cek jalur terlebih dahulu.',
    impact: 'Critical',
    actionable: true,
  },
  {
    category: 'vendor',
    icon: TrendingUp,
    priority: 'high',
    color: 'text-red-600',
    bg: 'bg-red-100',
    title: 'Vendor A Memiliki 30% Part Failure',
    description: 'Sparepart dari "Supplier KW Murah" memiliki failure rate 32%, menyebabkan 12 repeat service.',
    recommendation: 'Pindahkan pembelian ke "Toko Jaya Sparepart" (failure rate 6%) atau "Central Sparepart" (failure rate 10%).',
    impact: 'High',
    actionable: true,
  },
  {
    category: 'revenue',
    icon: DollarSign,
    priority: 'medium',
    color: 'text-green-600',
    bg: 'bg-green-100',
    title: 'Margin Sparepart Brandless Rendah',
    description: 'Sparepart brandless hanya menghasilkan margin 18%, padahal penjualannya tinggi.',
    recommendation: 'Pertimbangkan naikkan harga sparepart brandless atau beralih ke OEM yang margin lebih baik (28%).',
    impact: 'Medium',
    actionable: true,
  },
  {
    category: 'customer',
    icon: Users,
    priority: 'medium',
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    title: 'Repeat Customer Hanya 32%',
    description: 'Dari 342 pelanggan, hanya 109 yang melakukan transaksi lebih dari 1x.',
    recommendation: 'Implementasi program loyalitas atau diskon untuk repeat customer.',
    impact: 'Medium',
    actionable: true,
  },
  {
    category: 'performance',
    icon: Target,
    priority: 'low',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    title: 'Success Rate Service 92%',
    description: 'Success rate service sangat baik (92%), di atas standar industri (85%).',
    recommendation: 'Pertahankan kualitas service dan dokumentasikan best practice teknisi.',
    impact: 'Low',
    actionable: false,
  },
  {
    category: 'trend',
    icon: Zap,
    priority: 'medium',
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    title: 'Brand Infinix Meningkat 34%',
    description: 'Penjualan sparepart brand Infinix naik 34% dibanding bulan lalu.',
    recommendation: 'Pastikan stok sparepart Infinix mencukupi, terutama LCD Hot 10 dan IC Charging.',
    impact: 'Medium',
    actionable: true,
  },
  {
    category: 'deadstock',
    icon: Package,
    priority: 'high',
    color: 'text-red-600',
    bg: 'bg-red-100',
    title: 'Dead Stock Rp 8.5 Juta',
    description: '31 items tidak bergerak lebih dari 60 hari dengan total nilai Rp 8.500.000.',
    recommendation: 'Jalankan program clearance sale atau bundling untuk mengurangi dead stock.',
    impact: 'High',
    actionable: true,
  },
];

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'critical':
      return <Badge variant="destructive">Critical</Badge>;
    case 'high':
      return <Badge className="bg-orange-600">High</Badge>;
    case 'medium':
      return <Badge variant="default">Medium</Badge>;
    case 'low':
      return <Badge variant="secondary">Low</Badge>;
    default:
      return <Badge variant="outline">Info</Badge>;
  }
};

export function Insights() {
  return (
    <>
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white dark:bg-gray-900 rounded-full">
            <Lightbulb className="size-6 text-yellow-600" />
          </div>
          <div>
            <h2>Smart Insights Engine</h2>
            <p className="text-sm text-muted-foreground">
              Rekomendasi bisnis otomatis dari AI berdasarkan analisis data menyeluruh
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
          <div className="p-3 bg-white dark:bg-gray-900 rounded">
            <div className="text-2xl mb-1">{insights.length}</div>
            <div className="text-sm text-muted-foreground">Total Insights</div>
          </div>
          <div className="p-3 bg-white dark:bg-gray-900 rounded">
            <div className="text-2xl mb-1 text-red-600">
              {insights.filter(i => i.priority === 'critical' || i.priority === 'high').length}
            </div>
            <div className="text-sm text-muted-foreground">Critical/High Priority</div>
          </div>
          <div className="p-3 bg-white dark:bg-gray-900 rounded">
            <div className="text-2xl mb-1 text-green-600">
              {insights.filter(i => i.actionable).length}
            </div>
            <div className="text-sm text-muted-foreground">Actionable</div>
          </div>
          <div className="p-3 bg-white dark:bg-gray-900 rounded">
            <div className="text-2xl mb-1 text-blue-600">7</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {insights.map((insight, idx) => (
          <Card 
            key={idx} 
            className={`p-6 ${insight.priority === 'critical' ? 'border-2 border-red-500' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${insight.bg} shrink-0`}>
                <insight.icon className={`size-6 ${insight.color}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg">{insight.title}</h4>
                  <div className="flex gap-2">
                    {getPriorityBadge(insight.priority)}
                    {insight.actionable && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Actionable
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {insight.description}
                </p>

                <div className="p-3 bg-muted/50 rounded mb-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="size-4 text-yellow-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Recommendation:</div>
                      <div className="text-sm">{insight.recommendation}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-xs">
                      {insight.category}
                    </Badge>
                    <span className="text-muted-foreground">Impact: {insight.impact}</span>
                  </div>
                  {insight.actionable && (
                    <button className="text-primary hover:underline text-sm">
                      Take Action →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
