// OriginalName: TransactionHistory
// ShortName: History

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Badge } from '../../ui/badge'
import { Separator } from '../../ui/separator'
import { Download, Eye, Printer } from 'lucide-react'
import { toast } from 'sonner'
import { HistoryFilter } from './HistoryFilter'
import { HistoryList } from './HistoryList'
import { PrintDialog } from '../PrintDialog'
import type { Transaction, TransactionItem } from '../../../types/financial'

interface HistoryProps {
  transactions: Transaction[]
  storeInfo?: {
    storeName: string
    storeLogo?: string
    storeAddress?: string
    storePhone?: string
  }
}

export function History({ transactions, storeInfo }: HistoryProps) {
  // Filter states - LOCAL ONLY, no side effects
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'lunas' | 'hutang' | 'sebagian'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'pemasukan' | 'pengeluaran'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Detail dialog - READ ONLY
  const [detailTransaction, setDetailTransaction] = useState<Transaction | null>(null)
  
  // 🔧 FIX: Print dialog state
  const [printTransaction, setPrintTransaction] = useState<Transaction | null>(null)

  // Filter logic - PURE FUNCTION, no mutations
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          const matchesSearch =
            t.transactionNumber?.toLowerCase().includes(query) ||
            t.customerName?.toLowerCase().includes(query) ||
            t.catatan?.toLowerCase().includes(query)
          if (!matchesSearch) return false
        }

        // Status filter
        if (statusFilter !== 'all') {
          const status = t.paymentStatus || 'lunas'
          if (status !== statusFilter) return false
        }

        // Type filter
        if (typeFilter !== 'all') {
          if (t.type !== typeFilter) return false
        }

        // Date range filter
        const txDate = new Date(t.tanggal || t.createdAt)
        if (dateFrom) {
          const fromDate = new Date(dateFrom)
          if (txDate < fromDate) return false
        }
        if (dateTo) {
          const toDate = new Date(dateTo)
          toDate.setHours(23, 59, 59, 999) // End of day
          if (txDate > toDate) return false
        }

        return true
      })
      .sort((a, b) => {
        const dateA = new Date(a.tanggal || a.createdAt).getTime()
        const dateB = new Date(b.tanggal || b.createdAt).getTime()
        return dateB - dateA // Newest first
      })
  }, [transactions, searchQuery, statusFilter, typeFilter, dateFrom, dateTo])

  // Summary calculations - READ ONLY
  const summary = useMemo(() => {
    const total = filteredTransactions.length
    const totalAmount = filteredTransactions.reduce((sum, t) => {
      if (t.type === 'pemasukan') return sum + t.nominal
      return sum - t.nominal
    }, 0)
    const lunas = filteredTransactions.filter(t => (t.paymentStatus || 'lunas') === 'lunas').length
    const hutang = filteredTransactions.filter(t => (t.paymentStatus || 'lunas') === 'hutang').length
    const totalHutang = filteredTransactions
      .filter(t => (t.paymentStatus || 'lunas') !== 'lunas')
      .reduce((sum, t) => {
        const paid = t.paidAmount ?? (t.paymentStatus === 'lunas' ? t.nominal : 0)
        return sum + (t.nominal - paid)
      }, 0)

    return { total, totalAmount, lunas, hutang, totalHutang }
  }, [filteredTransactions])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Reset filters
  const handleResetFilter = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setTypeFilter('all')
    setDateFrom('')
    setDateTo('')
    toast.success('Filter direset')
  }

  // Export CSV - READ ONLY
  const handleExport = () => {
    try {
      const csvRows = [
        ['Tanggal', 'Invoice', 'Jenis', 'Customer', 'Total', 'Status'].join(','),
        ...filteredTransactions.map(t => [
          new Date(t.tanggal || t.createdAt).toLocaleDateString('id-ID'),
          t.transactionNumber || `TRX-${t.id?.slice(0, 8)}`,
          t.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran',
          t.customerName || '-',
          t.nominal,
          t.paymentStatus === 'hutang' ? 'Belum Lunas' : 
          t.paymentStatus === 'sebagian' ? 'Sebagian' : 
          'Lunas'
        ].join(','))
      ]

      const csvContent = csvRows.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `riwayat-transaksi-${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)

      toast.success('Data berhasil diexport')
    } catch (error) {
      toast.error('Gagal export data')
    }
  }

  // Share transaction - READ ONLY
  const handleShare = async (transaction: Transaction) => {
    const text = `
Transaksi ${transaction.transactionNumber || `TRX-${transaction.id?.slice(0, 8)}`}
Tanggal: ${new Date(transaction.tanggal || transaction.createdAt).toLocaleDateString('id-ID')}
Total: ${formatCurrency(transaction.nominal)}
Status: ${transaction.paymentStatus === 'lunas' ? 'Lunas' : transaction.paymentStatus === 'hutang' ? 'Belum Lunas' : 'Sebagian'}
    `.trim()

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Detail Transaksi',
          text: text
        })
        toast.success('Berhasil dibagikan')
      } else {
        await navigator.clipboard.writeText(text)
        toast.success('Disalin ke clipboard')
      }
    } catch (error) {
      // Silently fail if user cancels
    }
  }

  // 🔧 FIX: Print transaction - OPEN PREVIEW DIALOG
  const handlePrint = (transaction: Transaction) => {
    setPrintTransaction(transaction)
  }

  return (
    <div className="space-y-6">
      {/* Header dengan Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Riwayat Transaksi</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Daftar semua transaksi (read-only)
              </p>
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Transaksi</p>
              <p className="text-2xl font-bold">{summary.total}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Nominal</p>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalAmount)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Lunas / Hutang</p>
              <div className="flex items-center gap-2">
                <Badge variant="default">{summary.lunas}</Badge>
                <span className="text-muted-foreground">/</span>
                <Badge variant="destructive">{summary.hutang}</Badge>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Hutang</p>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(summary.totalHutang)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <HistoryFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onReset={handleResetFilter}
      />

      {/* List */}
      <Card>
        <CardContent className="p-6">
          <HistoryList
            transactions={filteredTransactions}
            onViewDetail={setDetailTransaction}
            onPrint={handlePrint}
            onShare={handleShare}
          />
        </CardContent>
      </Card>

      {/* Detail Dialog - READ ONLY */}
      <Dialog open={!!detailTransaction} onOpenChange={() => setDetailTransaction(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Transaksi (Read-Only)</DialogTitle>
          </DialogHeader>
          {detailTransaction && (
            <div className="space-y-4">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Invoice</p>
                  <p className="font-medium">
                    {detailTransaction.transactionNumber || `TRX-${detailTransaction.id?.slice(0, 8)}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal</p>
                  <p className="font-medium">
                    {formatDate(detailTransaction.tanggal || detailTransaction.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Jenis</p>
                  <Badge variant={detailTransaction.type === 'pemasukan' ? 'default' : 'outline'}>
                    {detailTransaction.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={
                    (detailTransaction.paymentStatus || 'lunas') === 'lunas' ? 'default' :
                    (detailTransaction.paymentStatus || 'lunas') === 'hutang' ? 'destructive' :
                    'secondary'
                  }>
                    {detailTransaction.paymentStatus === 'lunas' ? 'Lunas' :
                     detailTransaction.paymentStatus === 'hutang' ? 'Belum Lunas' :
                     detailTransaction.paymentStatus === 'sebagian' ? 'Sebagian' :
                     'Lunas'}
                  </Badge>
                </div>
              </div>

              {/* Customer Info */}
              {detailTransaction.customerName && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Customer</p>
                    <p className="font-medium">{detailTransaction.customerName}</p>
                    {detailTransaction.customerPhone && (
                      <p className="text-sm text-muted-foreground">{detailTransaction.customerPhone}</p>
                    )}
                  </div>
                </>
              )}

              {/* Items - SNAPSHOT dari transaction.items */}
              {detailTransaction.items && detailTransaction.items.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Items ({detailTransaction.items.length})</p>
                    <div className="space-y-2">
                      {detailTransaction.items.map((item: TransactionItem) => (
                        <div key={item.id} className="flex justify-between items-start p-3 bg-muted/50 rounded">
                          <div className="flex-1">
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity}x @ {formatCurrency(item.unitPrice)}
                            </p>
                          </div>
                          <p className="font-medium">{formatCurrency(item.total)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Payment Summary */}
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium">{formatCurrency(detailTransaction.nominal)}</span>
                </div>
                {detailTransaction.paymentStatus !== 'lunas' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dibayar</span>
                      <span className="font-medium">{formatCurrency(detailTransaction.paidAmount || 0)}</span>
                    </div>
                    <div className="flex justify-between text-destructive">
                      <span className="font-medium">Sisa Hutang</span>
                      <span className="font-bold">
                        {formatCurrency(detailTransaction.nominal - (detailTransaction.paidAmount || 0))}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Notes */}
              {detailTransaction.catatan && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Catatan</p>
                    <p className="text-sm">{detailTransaction.catatan}</p>
                  </div>
                </>
              )}

              {/* Actions */}
              <Separator />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handlePrint(detailTransaction)}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* 🔧 FIX: Print Preview Dialog */}
      {printTransaction && (
        <PrintDialog
          open={!!printTransaction}
          onClose={() => setPrintTransaction(null)}
          transaction={printTransaction}
          storeInfo={storeInfo || {
            storeName: 'Toko Saya',
            storeAddress: '',
            storePhone: ''
          }}
        />
      )}
    </div>
  )
}