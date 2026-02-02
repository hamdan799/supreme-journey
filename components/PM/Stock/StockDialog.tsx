// OriginalName: StockManagementDialog
// ShortName: StockDialog

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Badge } from '../../ui/badge'
import { Alert, AlertDescription } from '../../ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { Textarea } from '../../ui/textarea'
import {
  Package,
  TrendingUp,
  TrendingDown,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  History,
  Settings,
  Plus,
  Minus,
  ArrowUpCircle,
  ArrowDownCircle,
  Edit3,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Product, StockLedger, StockAdjustment, StockStatus } from '../../../types/inventory'

interface StockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
  stockStatus: StockStatus
  ledgers: StockLedger[]
  onStockIn: (qty: number, note: string) => void
  onStockOut: (qty: number, note: string) => void
  onAdjustment: (qtyAfter: number, reason: StockAdjustment['reason'], note: string) => void
}

export function StockDialog({
  open,
  onOpenChange,
  product,
  stockStatus,
  ledgers,
  onStockIn,
  onStockOut,
  onAdjustment,
}: StockDialogProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'adjust'>('overview')
  
  // Adjustment Form State
  const [adjustQty, setAdjustQty] = useState('')
  const [adjustReason, setAdjustReason] = useState<StockAdjustment['reason']>('physical_count')
  const [adjustNote, setAdjustNote] = useState('')

  // Quick Action State
  const [quickQty, setQuickQty] = useState('')
  const [quickNote, setQuickNote] = useState('')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date)
  }

  const getStockStatusInfo = () => {
    switch (stockStatus.status) {
      case 'out':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-destructive" />,
          label: 'Habis',
          color: 'destructive' as const
        }
      case 'low':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
          label: 'Menipis',
          color: 'default' as const
        }
      case 'safe':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
          label: 'Aman',
          color: 'default' as const
        }
    }
  }

  const getLedgerIcon = (type: StockLedger['type']) => {
    switch (type) {
      case 'IN':
        return <ArrowUpCircle className="w-4 h-4 text-green-500" />
      case 'OUT':
        return <ArrowDownCircle className="w-4 h-4 text-red-500" />
      case 'RESERVE':
        return <Lock className="w-4 h-4 text-blue-500" />
      case 'RELEASE':
        return <Unlock className="w-4 h-4 text-gray-500" />
      case 'ADJUST':
        return <Edit3 className="w-4 h-4 text-orange-500" />
    }
  }

  const getLedgerColor = (type: StockLedger['type']) => {
    switch (type) {
      case 'IN': return 'text-green-600'
      case 'OUT': return 'text-red-600'
      case 'RESERVE': return 'text-blue-600'
      case 'RELEASE': return 'text-gray-600'
      case 'ADJUST': return 'text-orange-600'
    }
  }

  const handleQuickStockIn = () => {
    const qty = parseInt(quickQty)
    if (!qty || qty <= 0) {
      toast.error('Jumlah harus lebih dari 0')
      return
    }
    if (!quickNote.trim()) {
      toast.error('Catatan wajib diisi')
      return
    }
    
    onStockIn(qty, quickNote)
    setQuickQty('')
    setQuickNote('')
    toast.success(`+${qty} stok berhasil ditambahkan`)
  }

  const handleQuickStockOut = () => {
    const qty = parseInt(quickQty)
    if (!qty || qty <= 0) {
      toast.error('Jumlah harus lebih dari 0')
      return
    }
    if (qty > stockStatus.available) {
      toast.error(`Stok tersedia hanya ${stockStatus.available}`)
      return
    }
    if (!quickNote.trim()) {
      toast.error('Catatan wajib diisi')
      return
    }
    
    onStockOut(qty, quickNote)
    setQuickQty('')
    setQuickNote('')
    toast.success(`-${qty} stok berhasil dikurangi`)
  }

  const handleAdjustment = () => {
    const qtyAfter = parseInt(adjustQty)
    if (isNaN(qtyAfter) || qtyAfter < 0) {
      toast.error('Jumlah harus angka positif atau 0')
      return
    }
    if (!adjustNote.trim() || adjustNote.trim().length < 10) {
      toast.error('Alasan harus minimal 10 karakter')
      return
    }

    onAdjustment(qtyAfter, adjustReason, adjustNote)
    setAdjustQty('')
    setAdjustNote('')
    setActiveTab('overview')
    toast.success('Penyesuaian stok berhasil')
  }

  const statusInfo = getStockStatusInfo()
  const costValue = (product.cost ?? product.purchase_price ?? 0) * stockStatus.total

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Kelola Stok: {product.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              <Package className="w-4 h-4 mr-2" />
              Ringkasan
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              Riwayat
            </TabsTrigger>
            <TabsTrigger value="adjust">
              <Settings className="w-4 h-4 mr-2" />
              Penyesuaian
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Ringkasan Stok */}
          <TabsContent value="overview" className="space-y-4">
            {/* Status Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Stok</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{stockStatus.total}</div>
                  <p className="text-xs text-muted-foreground">Unit</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Tersedia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-green-600">{stockStatus.available}</div>
                  <p className="text-xs text-muted-foreground">Siap digunakan</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Ter-reserve</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-blue-600">{stockStatus.reserved}</div>
                  <p className="text-xs text-muted-foreground">Nota service</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {statusInfo.icon}
                    <Badge variant={statusInfo.color}>{statusInfo.label}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Min: {stockStatus.min_alert}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Stock Value */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Nilai Stok</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl">{formatCurrency(costValue)}</div>
                <p className="text-xs text-muted-foreground">
                  Modal @ {formatCurrency(product.cost ?? product.purchase_price ?? 0)} × {stockStatus.total} unit
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Aksi Cepat</CardTitle>
                <CardDescription>
                  Untuk pembelian/restok manual atau koreksi sederhana
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Jumlah</Label>
                    <Input
                      type="number"
                      min="1"
                      value={quickQty}
                      onChange={(e) => setQuickQty(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Catatan</Label>
                    <Input
                      value={quickNote}
                      onChange={(e) => setQuickNote(e.target.value)}
                      placeholder="Pembelian, dll"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleQuickStockIn}
                    className="flex-1"
                    variant="default"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Stok Masuk
                  </Button>
                  <Button
                    onClick={handleQuickStockOut}
                    className="flex-1"
                    variant="destructive"
                  >
                    <Minus className="w-4 h-4 mr-2" />
                    Stok Keluar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Warnings */}
            {stockStatus.status === 'low' && (
              <Alert>
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  Stok menipis! Tersisa {stockStatus.available} unit (minimal {stockStatus.min_alert})
                </AlertDescription>
              </Alert>
            )}
            {stockStatus.status === 'out' && (
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  Stok habis! Segera lakukan restok.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* TAB 2: Riwayat Stok (Ledger) */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Riwayat Pergerakan Stok</CardTitle>
                <CardDescription>
                  Semua event perubahan stok produk ini
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ledgers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Belum ada riwayat stok</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Tipe</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead>Referensi</TableHead>
                          <TableHead>Catatan</TableHead>
                          <TableHead>User</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ledgers.map((ledger) => (
                          <TableRow key={ledger.id}>
                            <TableCell className="text-sm">
                              {formatDate(ledger.created_at)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getLedgerIcon(ledger.type)}
                                <span className="text-sm">{ledger.type}</span>
                              </div>
                            </TableCell>
                            <TableCell className={`text-right ${getLedgerColor(ledger.type)}`}>
                              {ledger.qty_change > 0 ? '+' : ''}
                              {ledger.qty_change}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <Badge variant="outline" className="text-xs">
                                  {ledger.ref_type}
                                </Badge>
                                {ledger.ref_id && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {ledger.ref_id.substring(0, 12)}...
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {ledger.note || '-'}
                            </TableCell>
                            <TableCell className="text-sm">
                              {ledger.user_name || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: Penyesuaian Manual */}
          <TabsContent value="adjust" className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                <strong>⚠️ Peringatan:</strong> Penyesuaian manual hanya untuk koreksi stok fisik, 
                barang rusak, atau kesalahan input. Perubahan ini tidak bisa dibatalkan.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Penyesuaian Stok Manual</CardTitle>
                <CardDescription>
                  Stok saat ini: <strong>{stockStatus.total} unit</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Stok Baru</Label>
                  <Input
                    type="number"
                    min="0"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(e.target.value)}
                    placeholder={stockStatus.total.toString()}
                  />
                  {adjustQty && (
                    <p className="text-sm text-muted-foreground">
                      Perubahan: {parseInt(adjustQty) - stockStatus.total > 0 ? '+' : ''}
                      {parseInt(adjustQty) - stockStatus.total} unit
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Alasan</Label>
                  <Select
                    value={adjustReason}
                    onValueChange={(v: StockAdjustment['reason']) => setAdjustReason(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physical_count">Selisih Stok Fisik</SelectItem>
                      <SelectItem value="damaged">Barang Rusak</SelectItem>
                      <SelectItem value="lost">Barang Hilang</SelectItem>
                      <SelectItem value="expired">Kadaluarsa</SelectItem>
                      <SelectItem value="correction">Koreksi Input</SelectItem>
                      <SelectItem value="other">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Alasan Detail (Wajib, min. 10 karakter)</Label>
                  <Textarea
                    value={adjustNote}
                    onChange={(e) => setAdjustNote(e.target.value)}
                    placeholder="Jelaskan alasan penyesuaian stok secara detail..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {adjustNote.length}/10 karakter minimum
                  </p>
                </div>

                <Button
                  onClick={handleAdjustment}
                  className="w-full"
                  variant="destructive"
                  disabled={!adjustQty || !adjustNote || adjustNote.length < 10}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Terapkan Penyesuaian
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}