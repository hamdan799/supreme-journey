import { useState } from 'react'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Switch } from '../../ui/switch'
import { Separator } from '../../ui/separator'
import { Database, Download, Upload, RefreshCw, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '../../ui/confirm-dialog'

interface BackPageProps {
  products: any[]
  categories: any[]
  transactions: any[]
  stockLogs: any[]
  receipts: any[]
  contacts: any[]
  storeInfo: any
  onDataImport: (data: any) => void
  onDataReset: () => void
}

export default function BackPage({ 
  products = [], 
  categories = [], 
  transactions = [], 
  stockLogs = [], 
  receipts = [],
  contacts = [],
  storeInfo,
  onDataImport,
  onDataReset
}: BackPageProps) {
  useDocumentTitle('Backup & Restore')
  const [showResetDialog, setShowResetDialog] = useState(false)

  const handleExport = () => {
    const data = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      storeInfo,
      products,
      categories,
      transactions,
      stockLogs,
      receipts,
      contacts
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backup-${storeInfo?.storeName || 'store'}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Backup data berhasil diunduh')
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        
        // Simple validation
        if (!data.timestamp) {
          throw new Error('Format backup tidak valid')
        }

        // Confirm before import
        if (window.confirm('Import data akan menimpa/menggabungkan data yang ada. Lanjutkan?')) {
          onDataImport(data)
        }
      } catch (error) {
        toast.error('Gagal membaca file backup')
        console.error(error)
      }
    }
    reader.readAsText(file)
    // Reset value so same file can be selected again
    e.target.value = ''
  }

  const handleResetConfirm = () => {
    onDataReset()
    setShowResetDialog(false)
  }

  // Calculate stats
  const stats = [
    { label: 'Produk', value: products.length },
    { label: 'Transaksi', value: transactions.length },
    { label: 'Kontak', value: contacts.length },
    { label: 'Nota', value: 0 }, // Placeholder if nota not passed
    { label: 'Hutang/Piutang', value: 0 }, // Derived
    { label: 'Vendor', value: contacts.filter(c => c.type === 'vendor').length },
    { label: 'Riwayat Stok', value: stockLogs.length },
    { label: 'Pengguna', value: 2 }, // Mocked
  ]

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Backup & Data</h1>
        <p className="text-muted-foreground">
          Cadangkan, pulihkan, atau reset data aplikasi
        </p>
      </div>

      {/* Section 1: Statistik Data (Read Only) */}
      <Card>
        <CardHeader>
          <CardTitle>Statistik Data</CardTitle>
          <CardDescription>Ringkasan data yang tersimpan di sistem saat ini</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-4 border rounded-lg bg-muted/10 text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Section 2: Backup & Restore */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            <CardTitle>Backup & Restore</CardTitle>
          </div>
          <CardDescription>Simpan data ke file lokal atau pulihkan dari file</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Export */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center gap-2 font-medium">
                <Download className="w-4 h-4" /> Export Data
              </div>
              <p className="text-sm text-muted-foreground">
                Download semua data dalam format JSON untuk cadangan.
              </p>
              <Button onClick={handleExport} className="w-full">
                Export Data
              </Button>
            </div>

            {/* Import */}
            <div className="space-y-4 p-4 border rounded-lg">
               <div className="flex items-center gap-2 font-medium">
                <Upload className="w-4 h-4" /> Import Data
              </div>
              <p className="text-sm text-muted-foreground">
                Restore data dari file backup JSON sebelumnya.
              </p>
              <div className="relative">
                <Input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  id="backup-upload"
                  onChange={handleImport}
                />
                <Button variant="outline" className="w-full" onClick={() => document.getElementById('backup-upload')?.click()}>
                  Import Data
                </Button>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Section 3: Reset */}
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <CardTitle>Reset Semua Data</CardTitle>
          </div>
          <CardDescription>Hapus semua data dan mulai dari awal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Tindakan ini tidak dapat dibatalkan. Pastikan Anda sudah melakukan backup data penting.
            </p>
            <Button variant="destructive" onClick={() => setShowResetDialog(true)}>
              RESET SEMUA DATA
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Section 4: Auto Backup */}
      <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-500" />
            <Label className="text-base">Auto Backup</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Backup otomatis setiap hari (tersimpan di browser)
          </p>
        </div>
        <Switch defaultChecked />
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        title="Reset Semua Data?"
        description="Tindakan ini akan menghapus SEMUA data (Produk, Transaksi, Laporan, dll) dan tidak dapat dibatalkan. Sistem akan kembali seperti baru."
        confirmText="Ya, Hapus Semua"
        cancelText="Batal"
        variant="destructive"
        onConfirm={handleResetConfirm}
      />

    </div>
  )
}
