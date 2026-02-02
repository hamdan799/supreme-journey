// OriginalName: DebtTrackingMain
// ShortName: DTMain

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog'
import { Label } from '../ui/label'
import {
  Clock,
  DollarSign,
  Users,
  AlertTriangle,
  Send,
  Plus,
  Download,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  TrendingUp,
  Calendar,
  User,
  Phone,
  FileText,
  History,
  Bell,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'
import { exportDebtReport } from '../../utils/exportHelpers'
import { DebtFrm } from './DebtFrm'
import { ReminderDialog as RemindDlg } from './RemindDlg'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import type { Contact } from '../../types/inventory'

interface EnhancedDTProps {
  transactions: any[]
  contacts?: Contact[]
  onTransactionCreate: (transaction: any) => void
  onTransactionUpdate: (id: string, updates: any) => void
  onTransactionDelete: (transactionId: string) => void
  onContactCreate?: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Contact | void>
  storeInfo: {
    storeName: string
    storeLogo?: string
  }
}

type SortField = 'name' | 'date' | 'total' | 'type'
type SortDirection = 'asc' | 'desc'

interface DebtSummaryItem {
  name: string
  phone: string
  type: 'piutang' | 'hutang'
  totalDebt: number
  transactions: any[]
  latestDate: Date
  hasOverdue: boolean
}

// OriginalName: EnhancedDT
// ShortName: DTMain

export function DTMain({
  transactions,
  contacts = [],
  onTransactionCreate,
  onTransactionUpdate,
  onTransactionDelete,
  onContactCreate,
  storeInfo
}: EnhancedDTProps) {
  const [showDebtForm, setShowDebtForm] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [showReminderDialog, setShowReminderDialog] = useState(false)
  const [reminderTransaction, setReminderTransaction] = useState<any>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedDebtItem, setSelectedDebtItem] = useState<DebtSummaryItem | null>(null)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const debtData = useMemo(() => {
    // Separate hutang (my debts to suppliers) and piutang (customer debts to me)
    const hutangTransactions = transactions.filter(t =>
      t.type === 'hutang' && (t.paymentStatus === 'hutang' || t.paymentStatus === 'sebagian')
    )

    const piutangTransactions = transactions.filter(t =>
      (t.type === 'piutang' || t.type === 'pemasukan') &&
      (t.paymentStatus === 'hutang' || t.paymentStatus === 'sebagian')
    )

    // Calculate total my debt
    const totalMyDebt = hutangTransactions.reduce((sum, t) => {
      if (t.paymentStatus === 'hutang') return sum + t.nominal
      return sum + (t.nominal - (t.paidAmount || 0))
    }, 0)

    // Calculate total customer debt
    const totalCustomerDebt = piutangTransactions.reduce((sum, t) => {
      if (t.paymentStatus === 'hutang') return sum + t.nominal
      return sum + (t.nominal - (t.paidAmount || 0))
    }, 0)

    // Group customer debts
    const customerDebts = piutangTransactions.reduce((acc, t) => {
      const customerName = t.customerName || 'Customer Tanpa Nama'
      if (!acc[customerName]) {
        acc[customerName] = {
          totalDebt: 0,
          transactions: [],
          phone: t.customerPhone || ''
        }
      }

      const debt = t.paymentStatus === 'hutang' ? t.nominal : (t.nominal - (t.paidAmount || 0))
      acc[customerName].totalDebt += debt
      acc[customerName].transactions.push(t)

      return acc
    }, {} as Record<string, any>)

    // Group my debts by supplier
    const myDebts = hutangTransactions.reduce((acc, t) => {
      const supplierName = t.customerName || 'Supplier Tanpa Nama'
      if (!acc[supplierName]) {
        acc[supplierName] = {
          totalDebt: 0,
          transactions: [],
          phone: t.customerPhone || ''
        }
      }

      const debt = t.paymentStatus === 'hutang' ? t.nominal : (t.nominal - (t.paidAmount || 0))
      acc[supplierName].totalDebt += debt
      acc[supplierName].transactions.push(t)

      return acc
    }, {} as Record<string, any>)

    // Create unified summary with type
    const unifiedSummary: DebtSummaryItem[] = []

    // Add piutang items
    Object.entries(customerDebts).forEach(([name, data]: [string, any]) => {
      const latestTx = data.transactions.sort((a: any, b: any) => 
        new Date(b.tanggal || b.createdAt).getTime() - new Date(a.tanggal || a.createdAt).getTime()
      )[0]

      const hasOverdue = data.transactions.some((t: any) => 
        t.dueDate && new Date(t.dueDate) < new Date()
      )

      unifiedSummary.push({
        name,
        phone: data.phone,
        type: 'piutang',
        totalDebt: data.totalDebt,
        transactions: data.transactions,
        latestDate: new Date(latestTx.tanggal || latestTx.createdAt),
        hasOverdue
      })
    })

    // Add hutang items
    Object.entries(myDebts).forEach(([name, data]: [string, any]) => {
      const latestTx = data.transactions.sort((a: any, b: any) => 
        new Date(b.tanggal || b.createdAt).getTime() - new Date(a.tanggal || a.createdAt).getTime()
      )[0]

      const hasOverdue = data.transactions.some((t: any) => 
        t.dueDate && new Date(t.dueDate) < new Date()
      )

      unifiedSummary.push({
        name,
        phone: data.phone,
        type: 'hutang',
        totalDebt: data.totalDebt,
        transactions: data.transactions,
        latestDate: new Date(latestTx.tanggal || latestTx.createdAt),
        hasOverdue
      })
    })

    // Calculate due this week
    const oneWeekFromNow = new Date()
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)

    const myDebtDueThisWeek = hutangTransactions
      .filter(t => t.dueDate && new Date(t.dueDate) <= oneWeekFromNow)
      .reduce((sum, t) => {
        const debt = t.paymentStatus === 'hutang' ? t.nominal : (t.nominal - (t.paidAmount || 0))
        return sum + debt
      }, 0)

    const customerDebtDueThisWeek = piutangTransactions
      .filter(t => t.dueDate && new Date(t.dueDate) <= oneWeekFromNow)
      .reduce((sum, t) => {
        const debt = t.paymentStatus === 'hutang' ? t.nominal : (t.nominal - (t.paidAmount || 0))
        return sum + debt
      }, 0)

    // Calculate overdue
    const now = new Date()
    const myDebtOverdue = hutangTransactions
      .filter(t => t.dueDate && new Date(t.dueDate) < now)
      .reduce((sum, t) => {
        const debt = t.paymentStatus === 'hutang' ? t.nominal : (t.nominal - (t.paidAmount || 0))
        return sum + debt
      }, 0)

    const customerDebtOverdue = piutangTransactions
      .filter(t => t.dueDate && new Date(t.dueDate) < now)
      .reduce((sum, t) => {
        const debt = t.paymentStatus === 'hutang' ? t.nominal : (t.nominal - (t.paidAmount || 0))
        return sum + debt
      }, 0)

    return {
      totalMyDebt,
      totalCustomerDebt,
      customerDebts: Object.entries(customerDebts),
      myDebts: Object.entries(myDebts),
      myDebtDueThisWeek,
      customerDebtDueThisWeek,
      myDebtOverdue,
      customerDebtOverdue,
      unifiedSummary
    }
  }, [transactions])

  // Sort unified summary
  const sortedSummary = useMemo(() => {
    const sorted = [...debtData.unifiedSummary]

    sorted.sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'date':
          comparison = a.latestDate.getTime() - b.latestDate.getTime()
          break
        case 'total':
          comparison = a.totalDebt - b.totalDebt
          break
        case 'type':
          comparison = a.type.localeCompare(b.type)
          break
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [debtData.unifiedSummary, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1" />
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4 ml-1" />
      : <ArrowDown className="w-4 h-4 ml-1" />
  }

  const handlePayDebt = () => {
    if (!selectedTransaction || !paymentAmount) return

    const amount = Number(paymentAmount.replace(/\D/g, ''))
    const remainingDebt = selectedTransaction.paymentStatus === 'hutang'
      ? selectedTransaction.nominal
      : (selectedTransaction.nominal - (selectedTransaction.paidAmount || 0))

    if (amount > remainingDebt) {
      toast.error('Jumlah pembayaran melebihi sisa hutang')
      return
    }

    const newPaidAmount = (selectedTransaction.paidAmount || 0) + amount
    const newStatus = newPaidAmount >= selectedTransaction.nominal ? 'lunas' : 'sebagian'

    onTransactionUpdate(selectedTransaction.id, {
      paymentStatus: newStatus,
      paidAmount: newPaidAmount
    })

    toast.success(`Pembayaran ${formatCurrency(amount)} berhasil dicatat`)
    setShowPaymentDialog(false)
    setSelectedTransaction(null)
    setPaymentAmount('')
  }

  const handlePayFullDebt = (item: DebtSummaryItem) => {
    // Pay all transactions for this person
    item.transactions.forEach(t => {
      const remainingDebt = t.paymentStatus === 'hutang' 
        ? t.nominal 
        : (t.nominal - (t.paidAmount || 0))
      
      if (remainingDebt > 0) {
        onTransactionUpdate(t.id, {
          paymentStatus: 'lunas',
          paidAmount: t.nominal
        })
      }
    })

    toast.success(`Semua ${item.type === 'piutang' ? 'piutang' : 'hutang'} dengan ${item.name} telah dilunaskan`)
    setShowDetailDialog(false)
    setSelectedDebtItem(null)
  }

  const openPaymentDialog = (transaction: any) => {
    setSelectedTransaction(transaction)
    setShowPaymentDialog(true)
    setPaymentAmount('')
  }

  const openReminderDialog = (transaction: any) => {
    setReminderTransaction(transaction)
    setShowReminderDialog(true)
  }

  const openDetailDialog = (item: DebtSummaryItem) => {
    setSelectedDebtItem(item)
    setShowDetailDialog(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1>Manajemen Hutang Piutang</h1>
          <p className="text-muted-foreground">Kelola hutang dan piutang secara terpisah</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              exportDebtReport(transactions)
              toast.success('Laporan berhasil diekspor')
            }}
            title="Export Laporan"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button onClick={() => setShowDebtForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Hutang/Piutang
          </Button>
        </div>
      </div>

      {/* Summary Cards - 2 Cards Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Piutang Card (Customer owes me) - GREEN */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Total Piutang
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(debtData.totalCustomerDebt)}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <div className="text-sm text-muted-foreground">Jatuh Tempo Minggu Ini</div>
                <div className="text-lg font-medium">{formatCurrency(debtData.customerDebtDueThisWeek)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Terlambat</div>
                <div className="text-lg font-medium text-destructive">{formatCurrency(debtData.customerDebtOverdue)}</div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // Scroll to unified table
                document.getElementById('unified-debts-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Detail
            </Button>
          </CardContent>
        </Card>

        {/* Hutang Card (I owe suppliers) - ORANGE */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-orange-500" />
              Total Hutang
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold text-orange-600">
              {formatCurrency(debtData.totalMyDebt)}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <div className="text-sm text-muted-foreground">Jatuh Tempo Minggu Ini</div>
                <div className="text-lg font-medium">{formatCurrency(debtData.myDebtDueThisWeek)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Terlambat</div>
                <div className="text-lg font-medium text-destructive">{formatCurrency(debtData.myDebtOverdue)}</div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // Scroll to unified table
                document.getElementById('unified-debts-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Detail
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Unified Debts Section */}
      <div id="unified-debts-section">
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Hutang Piutang</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Nama
                      {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center">
                      Tipe
                      {getSortIcon('type')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Tanggal
                      {getSortIcon('date')}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead 
                    className="text-right cursor-pointer select-none hover:bg-muted/50"
                    onClick={() => handleSort('total')}
                  >
                    <div className="flex items-center justify-end">
                      Total
                      {getSortIcon('total')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSummary.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Tidak ada hutang atau piutang
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedSummary.map((item) => (
                    <TableRow key={`${item.type}-${item.name}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.phone && (
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {item.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.type === 'piutang' ? 'default' : 'secondary'}
                          className={
                            item.type === 'piutang' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          }
                        >
                          {item.type === 'piutang' ? 'Piutang' : 'Hutang'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {item.latestDate.toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.hasOverdue ? (
                          <Badge variant="destructive">Terlambat</Badge>
                        ) : (
                          <Badge variant="outline">
                            {item.transactions.length} transaksi
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.totalDebt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDetailDialog(item)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detail {selectedDebtItem?.type === 'piutang' ? 'Piutang' : 'Hutang'} - {selectedDebtItem?.name}
            </DialogTitle>
            <DialogDescription>
              Kelola transaksi dan pembayaran
            </DialogDescription>
          </DialogHeader>

          {selectedDebtItem && (
            <div className="space-y-4 py-4">
              {/* Summary Card */}
              <Card className={
                selectedDebtItem.type === 'piutang'
                  ? 'border-green-200 dark:border-green-800'
                  : 'border-orange-200 dark:border-orange-800'
              }>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total {selectedDebtItem.type === 'piutang' ? 'Piutang' : 'Hutang'}:
                      </span>
                      <span className={`text-2xl font-bold ${
                        selectedDebtItem.type === 'piutang'
                          ? 'text-green-600'
                          : 'text-orange-600'
                      }`}>
                        {formatCurrency(selectedDebtItem.totalDebt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Jumlah Transaksi:</span>
                      <Badge variant="outline">{selectedDebtItem.transactions.length} transaksi</Badge>
                    </div>
                    {selectedDebtItem.phone && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Telepon:</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {selectedDebtItem.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handlePayFullDebt(selectedDebtItem)}
                  className="w-full"
                >
                  Lunaskan Semua
                </Button>
                {selectedDebtItem.type === 'piutang' && selectedDebtItem.phone && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      openReminderDialog(selectedDebtItem.transactions[0])
                      setShowDetailDialog(false)
                    }}
                    className="w-full"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Ingatkan
                  </Button>
                )}
              </div>

              {/* Transactions List */}
              <div className="space-y-2">
                <h3 className="font-medium">Daftar Transaksi</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {selectedDebtItem.transactions.map((t: any) => {
                    const remainingDebt = t.paymentStatus === 'hutang' 
                      ? t.nominal 
                      : (t.nominal - (t.paidAmount || 0))
                    
                    return (
                      <div key={t.id} className="p-3 border rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {new Date(t.tanggal || t.createdAt).toLocaleDateString('id-ID')}
                              </span>
                              {t.dueDate && (
                                <>
                                  <span className="text-muted-foreground">→</span>
                                  <span className={
                                    new Date(t.dueDate) < new Date() 
                                      ? 'text-destructive' 
                                      : ''
                                  }>
                                    {new Date(t.dueDate).toLocaleDateString('id-ID')}
                                  </span>
                                </>
                              )}
                            </div>
                            {t.catatan && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <FileText className="w-3 h-3" />
                                {t.catatan}
                              </div>
                            )}
                            <div className="font-medium">
                              {formatCurrency(remainingDebt)}
                            </div>
                            {t.paidAmount > 0 && (
                              <div className="text-xs text-muted-foreground">
                                Sudah dibayar: {formatCurrency(t.paidAmount)}
                              </div>
                            )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              openPaymentDialog(t)
                              setShowDetailDialog(false)
                            }}
                          >
                            {selectedDebtItem.type === 'piutang' ? 'Terima' : 'Bayar'}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Catat Pembayaran</DialogTitle>
            <DialogDescription>
              Masukkan jumlah pembayaran untuk transaksi ini.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedTransaction && (
              <>
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Hutang:</span>
                    <span className="font-medium">{formatCurrency(selectedTransaction.nominal)}</span>
                  </div>
                  {selectedTransaction.paidAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sudah Dibayar:</span>
                      <span className="font-medium">{formatCurrency(selectedTransaction.paidAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Sisa:</span>
                    <span className="font-bold">
                      {formatCurrency(
                        selectedTransaction.paymentStatus === 'hutang'
                          ? selectedTransaction.nominal
                          : (selectedTransaction.nominal - (selectedTransaction.paidAmount || 0))
                      )}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-amount">Jumlah Pembayaran</Label>
                  <Input
                    id="payment-amount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Batal
            </Button>
            <Button onClick={handlePayDebt}>
              Simpan Pembayaran
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Debt Form Dialog */}
      <DebtFrm
        open={showDebtForm}
        onClose={() => setShowDebtForm(false)}
        contacts={contacts}
        onTransactionCreate={onTransactionCreate}
        onContactCreate={onContactCreate}
      />

      {/* Reminder Dialog */}
      {reminderTransaction && (
        <RemindDlg
          open={showReminderDialog}
          onClose={() => setShowReminderDialog(false)}
          transaction={reminderTransaction}
          storeInfo={storeInfo}
        />
      )}
    </div>
  )
}
