import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Label } from '../../ui/label'
import { Switch } from '../../ui/switch'
import { Bell } from 'lucide-react'

export default function NotifPage() {
  useDocumentTitle('Notifikasi')

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifikasi</h1>
        <p className="text-muted-foreground">
          Atur preferensi pemberitahuan sistem
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <CardTitle>Event Notification</CardTitle>
          </div>
          <CardDescription>Pilih kejadian yang ingin Anda terima notifikasinya</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Alert Stok Menipis</Label>
              <p className="text-sm text-muted-foreground">
                Beritahu saat stok produk mencapai batas minimum
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Pengingat Pembayaran</Label>
              <p className="text-sm text-muted-foreground">
                Notifikasi jatuh tempo hutang/piutang H-1
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Laporan Harian</Label>
              <p className="text-sm text-muted-foreground">
                Rekap transaksi setiap tutup toko
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Laporan Mingguan</Label>
              <p className="text-sm text-muted-foreground">
                Ringkasan performa mingguan setiap Senin
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Laporan Bulanan</Label>
              <p className="text-sm text-muted-foreground">
                Analisis lengkap setiap awal bulan
              </p>
            </div>
            <Switch defaultChecked />
          </div>

        </CardContent>
      </Card>

      <p className="text-sm text-center text-muted-foreground">
        💡 Pengaturan notifikasi berlaku otomatis dan tetap aktif setelah aplikasi ditutup.
      </p>
    </div>
  )
}
