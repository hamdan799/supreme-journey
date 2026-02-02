// OriginalName: Backup (Settings)
// ShortName: BackTab

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import {
  Database,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  ShoppingCart,
  Users,
  Package,
  FileText,
  CreditCard,
  Building2,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import type { Product, Category, Contact, StockLog, Receipt } from '../../types/inventory'
import type { Transaction } from '../../types/financial'

interface BackTabProps {
  products: Product[]
  categories: Category[]
  transactions: Transaction[]
  stockLogs: StockLog[]
  receipts: Receipt[]
  contacts: Contact[]
  storeInfo: any
  onDataImport: (data: any) => void
  onDataReset: () => void
}

export function BackTab({
  products,
  categories,
  transactions,
  stockLogs,
  receipts,
  contacts,
  storeInfo,
  onDataImport,
  onDataReset
}: BackTabProps) {
  useDocumentTitle('Backup & Restore')
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  // Auto backup settings (persisted)
  const [autoBackup, setAutoBackup] = useState(() => {
    try {
      const saved = localStorage.getItem('settings_auto_backup')
      return saved ? JSON.parse(saved).enabled : false
    } catch {
      return false
    }
  })

  const [backupFrequency, setBackupFrequency] = useState<'daily' | 'weekly' | 'monthly'>(() => {
    try {
      const saved = localStorage.getItem('settings_auto_backup')
      return saved ? JSON.parse(saved).frequency : 'weekly'
    } catch {
      return 'weekly'
    }
  })

  // Persist auto backup settings
  const updateAutoBackup = (enabled: boolean, frequency?: 'daily' | 'weekly' | 'monthly') => {
    const settings = {
      enabled,
      frequency: frequency || backupFrequency
    }
    localStorage.setItem('settings_auto_backup', JSON.stringify(settings))
    setAutoBackup(enabled)
    if (frequency) setBackupFrequency(frequency)
    toast.success('Pengaturan auto backup disimpan')
  }

  const handleExportData = async () => {
    setIsExporting(true)
    
    try {
      // Get all data from localStorage
      const debts = JSON.parse(localStorage.getItem('debts-data') || '[]')
      const vendors = JSON.parse(localStorage.getItem('vendors-data') || '[]')
      const notas = JSON.parse(localStorage.getItem('nota-storage') || '{"notas":[]}')
      const users = JSON.parse(localStorage.getItem('users') || '[]')

      const data = {
        version: '2.6.1',
        exportedAt: new Date().toISOString(),
        data: {
          products,
          categories,
          transactions,
          stockLogs,
          receipts,
          contacts,
          debts,
          vendors,
          notas: notas.notas || [],
          users,
          storeInfo,
        }
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Data berhasil diexport')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Gagal mengexport data')
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        
        // Validate backup file
        if (!imported.version || !imported.data) {
          throw new Error('Format file tidak valid')
        }

        const { data } = imported

        // Validate required fields
        if (!data.products || !data.transactions) {
          throw new Error('Data backup tidak lengkap')
        }

        // Import data
        onDataImport(data)
        
        toast.success('Data berhasil diimport')
      } catch (error: any) {
        console.error('Import error:', error)
        toast.error(error.message || 'Format file tidak valid atau corrupt')
      } finally {
        setIsImporting(false)
        // Reset input
        e.target.value = ''
      }
    }
    
    reader.onerror = () => {
      setIsImporting(false)
      toast.error('Gagal membaca file')
    }
    
    reader.readAsText(file)
  }

  const handleReset = () => {
    try {
      onDataReset()
      setShowResetDialog(false)
      toast.success('Semua data berhasil direset')
    } catch (error) {
      console.error('Reset failed:', error)
      toast.error('Gagal mereset data')
    }
  }

  // Calculate total data count
  const debtsCount = JSON.parse(localStorage.getItem('debts-data') || '[]').length
  const vendorsCount = JSON.parse(localStorage.getItem('vendors-data') || '[]').length
  const notasData = JSON.parse(localStorage.getItem('nota-storage') || '{"notas":[]}')
  const notasCount = notasData.notas?.length || 0
  const usersCount = JSON.parse(localStorage.getItem('users') || '[]').length

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl">Backup & Restore</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Backup data Anda dan restore dari file backup
          </p>
        </div>
      </div>

    <div className="space-y-6">
      {/* Data Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistik Data</CardTitle>
          <CardDescription>
            Ringkasan jumlah data yang tersimpan dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="font-medium">{products.length}</p>
              <p className="text-sm text-muted-foreground">Produk</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="font-medium">{transactions.length}</p>
              <p className="text-sm text-muted-foreground">Transaksi</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="font-medium">{contacts.length}</p>
              <p className="text-sm text-muted-foreground">Kontak</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="font-medium">{notasCount}</p>
              <p className="text-sm text-muted-foreground">Nota</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="font-medium">{debtsCount}</p>
              <p className="text-sm text-muted-foreground">Hutang/Piutang</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-cyan-500" />
              <p className="font-medium">{vendorsCount}</p>
              <p className="text-sm text-muted-foreground">Vendor</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Database className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
              <p className="font-medium">{stockLogs.length}</p>
              <p className="text-sm text-muted-foreground">Riwayat Stock</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-pink-500" />
              <p className="font-medium">{usersCount}</p>
              <p className="text-sm text-muted-foreground">Pengguna</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup & Restore */}
      <Card>
        <CardHeader>
          <CardTitle>Backup & Restore</CardTitle>
          <CardDescription>
            Kelola backup data untuk keamanan dan pemulihan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-muted-foreground">
                Download semua data dalam format JSON
              </p>
            </div>
            <Button onClick={handleExportData} disabled={isExporting}>
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isExporting ? 'Mengexport...' : 'Export'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Import Data</p>
              <p className="text-sm text-muted-foreground">
                Restore data dari file backup
              </p>
            </div>
            <div>
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
                disabled={isImporting}
              />
              <Button
                onClick={() => document.getElementById('import-file')?.click()}
                variant="outline"
                disabled={isImporting}
              >
                {isImporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {isImporting ? 'Mengimport...' : 'Import'}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
            <div>
              <p className="font-medium text-destructive">Reset Semua Data</p>
              <p className="text-sm text-muted-foreground">
                Hapus semua data dan mulai dari awal
              </p>
            </div>
            <Button variant="destructive" onClick={() => setShowResetDialog(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Auto Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Auto Backup</CardTitle>
          <CardDescription>
            Atur backup otomatis untuk perlindungan data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Auto Backup</p>
              <p className="text-sm text-muted-foreground">
                Backup otomatis sesuai jadwal
              </p>
            </div>
            <Switch
              checked={autoBackup}
              onCheckedChange={(checked) => updateAutoBackup(checked)}
            />
          </div>

          {autoBackup && (
            <div className="ml-4 space-y-2">
              <Label>Frekuensi Backup</Label>
              <Select
                value={backupFrequency}
                onValueChange={(v: 'daily' | 'weekly' | 'monthly') => 
                  updateAutoBackup(true, v)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Harian</SelectItem>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                💡 Auto backup akan menyimpan data ke browser storage secara otomatis
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Konfirmasi Reset Data
            </DialogTitle>
            <DialogDescription>
              Tindakan ini akan menghapus SEMUA data termasuk produk, transaksi, dan pengaturan.
              Data yang dihapus tidak dapat dikembalikan!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg space-y-2">
              <p className="font-medium text-destructive">Data yang akan dihapus:</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• {products.length} Produk</li>
                <li>• {categories.length} Kategori</li>
                <li>• {transactions.length} Transaksi</li>
                <li>• {contacts.length} Kontak</li>
                <li>• {debtsCount} Hutang/Piutang</li>
                <li>• {notasCount} Nota</li>
                <li>• {vendorsCount} Vendor</li>
                <li>• {stockLogs.length} Riwayat Stock</li>
                <li>• {usersCount} Pengguna</li>
                <li>• Semua pengaturan sistem</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong>Saran:</strong> Ekspor data terlebih dahulu sebagai backup sebelum melakukan reset.
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowResetDialog(false)}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReset}
              className="w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Ya, Reset Semua Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  )
}
