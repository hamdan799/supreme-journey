// OriginalName: TransactionStats
// ShortName: TxStats

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react'

interface StatsProps {
  transactions: any[]
}

export function Stats({ transactions }: StatsProps) {
  const stats = useMemo(() => {
    const sales = transactions.filter(t => t.type === 'pemasukan')
    const expenses = transactions.filter(t => t.type === 'pengeluaran')
    
    const totalRevenue = sales.reduce((sum, t) => sum + t.nominal, 0)
    
    // FIX: Total expense = manual expenses + cost of goods (modal from sales)
    const totalCost = sales.reduce((sum, t) => sum + (t.totalCost || 0), 0)
    const totalManualExpense = expenses.reduce((sum, t) => sum + t.nominal, 0)
    const totalExpenses = totalManualExpense + totalCost

    const pendingPayments = transactions
      .filter(t => t.paymentStatus === 'hutang' || t.paymentStatus === 'sebagian')
      .reduce((sum, t) => {
        if (t.paymentStatus === 'hutang') return sum + t.nominal
        return sum + (t.nominal - (t.paidAmount || 0))
      }, 0)

    return {
      totalRevenue,
      totalExpenses,
      totalProfit: totalRevenue - totalExpenses,
      pendingPayments
    }
  }, [transactions])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Total Penjualan</CardTitle>
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(stats.totalRevenue)}
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-rose-500 bg-gradient-to-br from-rose-50/50 to-transparent dark:from-rose-950/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-rose-900 dark:text-rose-100">Total Pengeluaran</CardTitle>
          <div className="p-2 rounded-lg bg-rose-500/10">
            <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            {formatCurrency(stats.totalExpenses)}
          </div>
        </CardContent>
      </Card>
      
      <Card className={`border-l-4 ${stats.totalProfit >= 0 ? 'border-l-blue-500' : 'border-l-red-500'} bg-gradient-to-br ${stats.totalProfit >= 0 ? 'from-blue-50/50 to-transparent dark:from-blue-950/20' : 'from-red-50/50 to-transparent dark:from-red-950/20'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${stats.totalProfit >= 0 ? 'text-blue-900 dark:text-blue-100' : 'text-red-900 dark:text-red-100'}`}>
            Profit
          </CardTitle>
          <div className={`p-2 rounded-lg ${stats.totalProfit >= 0 ? 'bg-blue-500/10' : 'bg-red-500/10'}`}>
            <DollarSign className={`h-4 w-4 ${stats.totalProfit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(stats.totalProfit)}
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-100">Hutang Tertunda</CardTitle>
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {formatCurrency(stats.pendingPayments)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}