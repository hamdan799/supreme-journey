// OriginalName: EnhancedStockReport
// ShortName: StockRpt

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  TrendingUp,
  TrendingDown,
  Package,
  Download,
  Search,
  Calendar,
  Filter,
  ArrowUpCircle,
  ArrowDownCircle,
  FileText,
  User,
  Edit,
  Trash2,
  Printer
} from 'lucide-react'
import { ConfirmDialog } from '../ui/confirm-dialog'
import { toast } from 'sonner'
import type { StockLog, Product, Category } from '../../types/inventory'

interface EnhancedStockReportProps {
  stockLogs: StockLog[]
  products: Product[]
  categories: Category[]
  onStockLogUpdate?: (id: string, updates: Partial<StockLog>) => void
  onStockLogDelete?: (id: string) => void
}

export function StockRpt({ 
  stockLogs, 
  products, 
  categories,
  onStockLogUpdate,
  onStockLogDelete 
}: EnhancedStockReportProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'masuk' | 'keluar'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [deleteLogId, setDeleteLogId] = useState<string | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Calculate totals
  const totals = useMemo(() => {
    const incomingLogs = stockLogs.filter(log => log.type === 'masuk')
    const outgoingLogs = stockLogs.filter(log => log.type === 'keluar')

    const totalIn = incomingLogs.reduce((sum, log) => sum + log.jumlah, 0)
    const totalOut = outgoingLogs.reduce((sum, log) => sum + log.jumlah, 0)

    return {
      totalIn,
      totalOut,
      incomingCount: incomingLogs.length,
      outgoingCount: outgoingLogs.length
    }
  }, [stockLogs])

  // Filter and search logs
  const filteredLogs = useMemo(() => {
    return stockLogs.filter(log => {
      // Filter by type
      if (filterType !== 'all' && log.type !== filterType) return false

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesProduct = log.productName?.toLowerCase().includes(query)
        const matchesReference = log.reference?.toLowerCase().includes(query)
        const matchesSupplier = log.supplierName?.toLowerCase().includes(query)
        const matchesNotes = log.notes?.toLowerCase().includes(query)
        
        if (!matchesProduct && !matchesReference && !matchesSupplier && !matchesNotes) {
          return false
        }
      }

      // Filter by category
      if (filterCategory !== 'all') {
        const product = products.find(p => p.id === log.productId)
        if (!product || product.categoryId !== filterCategory) return false
      }

      // Filter by date range
      if (dateFrom) {
        const logDate = new Date(log.tanggal || log.createdAt)
        const fromDate = new Date(dateFrom)
        if (logDate < fromDate) return false
      }

      if (dateTo) {
        const logDate = new Date(log.tanggal || log.createdAt)
        const toDate = new Date(dateTo)
        toDate.setHours(23, 59, 59, 999)
        if (logDate > toDate) return false
      }

      return true
    })
  }, [stockLogs, searchQuery, filterType, filterCategory, dateFrom, dateTo, products])

  // Group logs by date
  const logsByDate = useMemo(() => {
    const grouped = filteredLogs.reduce((acc, log) => {
      const date = new Date(log.tanggal || log.createdAt)
      const dateKey = date.toISOString().split('T')[0]
      
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(log)
      
      return acc
    }, {} as Record<string, StockLog[]>)

    // Sort by date descending
    return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filteredLogs])

  const handleExport = () => {
    const csvContent = [
      ['Tanggal', 'Produk', 'Tipe', 'Jumlah', 'Referensi', 'Supplier', 'Catatan'].join(','),
      ...filteredLogs.map(log => [
        new Date(log.tanggal || log.createdAt).toLocaleDateString('id-ID'),
        log.productName,
        log.type === 'masuk' ? 'Masuk' : 'Keluar',
        log.jumlah,
        log.reference || '-',
        log.supplierName || '-',
        log.notes || '-'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `laporan-stock-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Laporan berhasil diexport')
  }

  const getSourceLabel = (log: StockLog) => {
    if (log.reference) {
      if (log.reference.includes('POS')) return 'POS Sale'
      if (log.reference.includes('Update')) return 'Update Stock'
      if (log.reference.includes('Import')) return 'Import Data'
      if (log.reference.includes('Manual')) return 'Input Manual'
      if (log.reference.includes('Adjustment')) return 'Penyesuaian'
      return log.reference
    }
    return log.type === 'masuk' ? 'Stock Masuk' : 'Stock Keluar'
  }

  const handlePrintLog = (log: StockLog) => {
    window.print()
    toast.success('Membuka print preview...')
  }

  const handleDeleteLog = (logId: string) => {
    if (onStockLogDelete) {
      onStockLogDelete(logId)
      toast.success('Log berhasil dihapus')
    }
    setDeleteLogId(null)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Log Masuk Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpCircle className="w-5 h-5 text-green-500" />
              Log Masuk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Total Item Masuk</div>
              <div className="text-3xl font-bold text-green-600">
                {totals.totalIn.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Jumlah Transaksi</span>
                <span className="font-medium">{totals.incomingCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Log Keluar Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowDownCircle className="w-5 h-5 text-red-500" />
              Log Keluar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Total Item Keluar</div>
              <div className="text-3xl font-bold text-red-600">
                {totals.totalOut.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Jumlah Transaksi</span>
                <span className="font-medium">{totals.outgoingCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Riwayat Pergerakan Stock</CardTitle>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari produk, supplier, referensi, catatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="masuk">Stock Masuk</SelectItem>
                <SelectItem value="keluar">Stock Keluar</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="Dari Tanggal"
            />

            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="Sampai Tanggal"
            />
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{filteredLogs.length} hasil ditemukan</span>
            {(searchQuery || filterType !== 'all' || filterCategory !== 'all' || dateFrom || dateTo) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setFilterType('all')
                  setFilterCategory('all')
                  setDateFrom('')
                  setDateTo('')
                }}
              >
                Reset Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Logs by Date */}
      {logsByDate.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Tidak ada log pergerakan stock</p>
          </CardContent>
        </Card>
      ) : (
        logsByDate.map(([date, logs]) => (
          <Card key={date}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="w-4 h-4" />
                {new Date(date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
                <Badge variant="outline" className="ml-auto">
                  {logs.length} transaksi
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                    <TableHead>Sumber</TableHead>
                    <TableHead>Supplier/Customer</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {new Date(log.tanggal || log.createdAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span>{log.productName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={log.type === 'masuk' ? 'default' : 'secondary'}>
                          {log.type === 'masuk' ? (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Masuk
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <TrendingDown className="w-3 h-3" />
                              Keluar
                            </div>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {log.type === 'masuk' ? '+' : '-'}{log.jumlah}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <FileText className="w-3 h-3 text-muted-foreground" />
                          {getSourceLabel(log)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.supplierName ? (
                          <div className="flex items-center gap-1 text-sm">
                            <User className="w-3 h-3 text-muted-foreground" />
                            {log.supplierName}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {log.notes || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePrintLog(log)}
                            title="Print"
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                          {onStockLogDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteLogId(log.id)}
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteLogId}
        onOpenChange={(open) => !open && setDeleteLogId(null)}
        title="Hapus Log Stock?"
        description="Log ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={() => deleteLogId && handleDeleteLog(deleteLogId)}
        variant="destructive"
      />
    </div>
  )
}
