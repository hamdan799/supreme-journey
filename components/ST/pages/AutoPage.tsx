import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Label } from '../../ui/label'
import { Switch } from '../../ui/switch'
import { Separator } from '../../ui/separator'
import { Zap, Clock, MessageSquare, Mail } from 'lucide-react'
import { Badge } from '../../ui/badge'

export default function AutoPage() {
  useDocumentTitle('Otomasi Sistem')

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Otomasi Sistem</h1>
        <p className="text-muted-foreground">
          Konfigurasi perilaku otomatis aplikasi
        </p>
      </div>

      {/* Section: Otomasi Aktif */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <CardTitle>Otomasi Aktif</CardTitle>
          </div>
          <CardDescription>Fitur otomatis yang tersedia saat ini</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Auto Update Stok</Label>
              <p className="text-sm text-muted-foreground">
                Otomatis kurangi stok saat transaksi selesai
              </p>
            </div>
            <Switch defaultChecked disabled />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Auto Sync Inventory</Label>
              <p className="text-sm text-muted-foreground">
                Sinkronisasi stok real-time antar device
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Low Stock Automation</Label>
              <p className="text-sm text-muted-foreground">
                Tandai produk dengan stok menipis secara otomatis
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Due Debt Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Pemberitahuan otomatis saat hutang jatuh tempo
              </p>
            </div>
            <Switch defaultChecked />
          </div>

        </CardContent>
      </Card>

      {/* Section: Coming Soon */}
      <Card className="opacity-75 bg-muted/20 border-dashed">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-muted-foreground">Coming Soon</CardTitle>
          </div>
          <CardDescription>Fitur dalam pengembangan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pointer-events-none select-none">
          
          <div className="flex items-center justify-between grayscale opacity-60">
            <div className="space-y-0.5">
              <Label className="text-base">Scheduled Backup</Label>
              <p className="text-sm text-muted-foreground">
                Backup database otomatis ke cloud
              </p>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>

          <div className="flex items-center justify-between grayscale opacity-60">
            <div className="space-y-0.5">
               <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <Label className="text-base">WhatsApp Auto Reminders</Label>
               </div>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>

          <div className="flex items-center justify-between grayscale opacity-60">
            <div className="space-y-0.5">
               <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <Label className="text-base">Email Reports</Label>
               </div>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
