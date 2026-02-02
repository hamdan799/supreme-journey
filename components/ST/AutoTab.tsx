// OriginalName: Automation (Settings)
// ShortName: AutoTab

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Badge } from '../ui/badge'
import { Zap, CheckCircle2, Package, Bell, RefreshCw } from 'lucide-react'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function AutoTab() {
  useDocumentTitle('Pengaturan Otomasi')
  // Show actual automation features that are already implemented
  const automations = [
    {
      icon: Package,
      label: 'Auto Update Stock',
      description: 'Stock otomatis terupdate saat ada transaksi penjualan atau pembelian',
      status: 'active' as const,
      statusText: 'Aktif'
    },
    {
      icon: RefreshCw,
      label: 'Auto Sync Inventory',
      description: 'Sinkronisasi otomatis antara transaksi, nota, dan inventory',
      status: 'active' as const,
      statusText: 'Aktif'
    },
    {
      icon: Bell,
      label: 'Low Stock Notifications',
      description: 'Notifikasi otomatis saat stock produk mencapai batas minimum',
      status: 'active' as const,
      statusText: 'Aktif'
    },
    {
      icon: Bell,
      label: 'Due Debt Alerts',
      description: 'Pengingat otomatis untuk hutang/piutang yang jatuh tempo',
      status: 'active' as const,
      statusText: 'Aktif'
    }
  ]

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl">Pengaturan Otomasi</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola fitur otomasi dan penjadwalan sistem
          </p>
        </div>
      </div>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Automatisasi
        </CardTitle>
        <CardDescription>
          Fitur-fitur otomatis yang sedang berjalan dalam sistem untuk efisiensi operasional
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {automations.map((auto, index) => {
          const Icon = auto.icon
          return (
            <div 
              key={index}
              className="flex items-start justify-between p-4 border rounded-lg"
            >
              <div className="flex items-start gap-3 flex-1">
                <Icon className="w-5 h-5 mt-0.5 text-green-500" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{auto.label}</p>
                    <Badge variant={auto.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {auto.statusText}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {auto.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}

        <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✅ <strong>Semua Otomasi Aktif:</strong> Fitur-fitur di atas berjalan secara otomatis 
            di background untuk memastikan data Anda selalu akurat dan ter-update.
          </p>
        </div>

        {/* Future automation features */}
        <div className="mt-6 space-y-3 opacity-50">
          <div className="p-4 border border-dashed rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4" />
              <p className="font-medium text-sm">Scheduled Backups</p>
              <Badge variant="outline" className="text-xs">Coming Soon</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Backup otomatis terjadwal setiap hari/minggu/bulan
            </p>
          </div>
          <div className="p-4 border border-dashed rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4" />
              <p className="font-medium text-sm">WhatsApp Auto Reminders</p>
              <Badge variant="outline" className="text-xs">Coming Soon</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Pengingat otomatis via WhatsApp untuk hutang jatuh tempo
            </p>
          </div>
          <div className="p-4 border border-dashed rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4" />
              <p className="font-medium text-sm">Email Reports</p>
              <Badge variant="outline" className="text-xs">Coming Soon</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Laporan harian/mingguan/bulanan otomatis via email
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
