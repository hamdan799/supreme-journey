// OriginalName: FR (Financial Reports)
// ShortName: FR

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { TrendingUp, TrendingDown, DollarSign, Receipt, Download } from 'lucide-react'
import { exportSalesReport } from '../utils/exportHelpers'
import { toast } from 'sonner'

interface FRProps {
  transactions: any[]
  products: any[]
  stockLogs: any[]
  receipts: any[]
}

export function FR({ transactions, products, stockLogs, receipts }: FRProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const financialData = useMemo(() => {
    const sales = transactions.filter(t => t.type === 'pemasukan')
    const expenseList = transactions.filter(t => t.type === 'pengeluaran')
    
    const revenue = sales.reduce((sum, t) => sum + t.nominal, 0)
    
    // FIX: Total expense = manual expenses + cost of goods (modal from sales)
    const totalCost = sales.reduce((sum, t) => sum + (t.totalCost || 0), 0)
    const totalManualExpense = expenseList.reduce((sum, t) => sum + t.nominal, 0)
    const expenses = totalManualExpense + totalCost
    
    const profit = revenue - expenses
    
    return { revenue, expenses, profit }
  }, [transactions])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Laporan Keuangan</h1>
          <p className="text-muted-foreground">Analisis performa keuangan bisnis</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            exportSalesReport(transactions)
            toast.success('Laporan penjualan berhasil diekspor')
          }}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Laporan
        </Button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(financialData.revenue)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(financialData.expenses)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keuntungan Bersih</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${financialData.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(financialData.profit)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada transaksi</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.slice(-10).reverse().map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      transaction.type === 'pemasukan' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <div className="font-medium">
                        {transaction.customerName || 'Transaksi'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.catatan} | {new Date(transaction.tanggal).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${
                      transaction.type === 'pemasukan' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'pemasukan' ? '+' : '-'}{formatCurrency(transaction.nominal)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}