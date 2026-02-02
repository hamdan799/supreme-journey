// OriginalName: DashboardSummaryCard
// ShortName: DBSum

import { Card } from '../ui/card'
import { TrendingUp, TrendingDown, Wallet, Activity, Plus, AlertTriangle, Package } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import type { Product } from '../../types/inventory'

interface SummaryProps {
  transactions: any[]
  products?: Product[]
  onNavigateToAnalysis: (filter: 'sale' | 'expense' | 'all') => void
  onNavigateToProduct?: () => void
  onAddTransaction?: () => void
  isKasirMode?: boolean
}

export function DashboardSummaryCard({ 
  transactions, 
  products = [],
  onNavigateToAnalysis, 
  onNavigateToProduct,
  onAddTransaction,
  isKasirMode = false 
}: SummaryProps) {
  // Calculate totals
  const totalSales = transactions
    .filter(t => t.type === 'pemasukan')
    .reduce((sum, t) => sum + t.nominal, 0)

  // Calculate total cost/modal from sales transactions
  const totalCost = transactions
    .filter(t => t.type === 'pemasukan')
    .reduce((sum, t) => sum + (t.totalCost || 0), 0)

  // Calculate manual expenses
  const expenseTransactions = transactions.filter(t => t.type === 'pengeluaran')
  const totalManualExpenses = expenseTransactions.reduce((sum, t) => sum + t.nominal, 0)
  
  // Total expenses = manual expenses + cost of goods sold (modal)
  const totalExpenses = totalManualExpenses + totalCost
  
  // Debug log
  console.log('📊 All transactions:', transactions.length, transactions);
  console.log('📊 Total Sales:', totalSales);
  console.log('📊 Total Cost/Modal:', totalCost);
  console.log('📊 Manual Expense transactions:', expenseTransactions.length, expenseTransactions);
  console.log('📊 Total Manual Expenses:', totalManualExpenses);
  console.log('📊 Total Expenses (Manual + Modal):', totalExpenses);

  const profit = totalSales - totalExpenses
  const profitPercentage = totalSales > 0 ? (profit / totalSales) * 100 : 0

  // Low stock alert
  const lowStockProducts = products.filter(p => p.stock <= (p.minStock || 0))
  const lowStockCount = lowStockProducts.length

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="relative space-y-4">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md rounded-[13px]">
        {/* Top Row: Sales & Expense */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Penjualan - Kiri Atas */}
          <div
            onClick={() => onNavigateToAnalysis('sale')}
            className="relative p-6 border-b md:border-b-0 md:border-r border-border/50 cursor-pointer hover:scale-[1.02] transition-all duration-200 group overflow-hidden"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-emerald-600 opacity-80" />
            
            <div className="relative flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <p className="text-sm text-muted-foreground font-medium">Total Penjualan</p>
                <p className="text-3xl md:text-4xl text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(totalSales)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transactions.filter(t => t.type === 'pemasukan').length} transaksi
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/20 group-hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors">
                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Pengeluaran - Kanan Atas */}
          <div
            onClick={() => onNavigateToAnalysis('expense')}
            className="relative p-6 border-b border-border/50 cursor-pointer hover:scale-[1.02] transition-all duration-200 group overflow-hidden"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-rose-400/5 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-500 to-rose-600 opacity-80" />
            
            <div className="relative flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <p className="text-sm text-muted-foreground font-medium">Total Pengeluaran</p>
                <p className="text-3xl md:text-4xl text-rose-600 dark:text-rose-400">
                  {formatCurrency(totalExpenses)}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{expenseTransactions.length} manual</span>
                  {totalCost > 0 && (
                    <>
                      <span>•</span>
                      <span>Modal: {formatCurrency(totalCost)}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/20 group-hover:bg-rose-500/30 border border-rose-500/30 transition-colors">
                <TrendingDown className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Profit & Percentage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Profit - Kiri Bawah */}
          <div className="relative p-6 border-r border-border/50 overflow-hidden group">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600 opacity-80" />
            
            <div className="relative flex items-center gap-4">
              <div className="p-4 rounded-xl bg-blue-500/20 border border-blue-500/30">
                <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm text-muted-foreground font-medium">Profit Bersih</p>
                {isKasirMode ? (
                  <p className="text-3xl md:text-4xl text-muted-foreground blur-sm select-none">
                    Rp ••••••���•
                  </p>
                ) : (
                  <p className="text-3xl md:text-4xl text-blue-600 dark:text-blue-400">
                    {formatCurrency(profit)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Percentage - Kanan Bawah */}
          <div className="relative p-6 overflow-hidden group">
            {/* Gradient Background - Dynamic based on profit */}
            <div className={`absolute inset-0 bg-gradient-to-br ${
              profitPercentage >= 0 
                ? 'from-emerald-500/10 via-emerald-400/5' 
                : 'from-rose-500/10 via-rose-400/5'
            } to-transparent opacity-60 group-hover:opacity-100 transition-opacity`} />
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${
              profitPercentage >= 0
                ? 'from-emerald-500 to-emerald-600'
                : 'from-rose-500 to-rose-600'
            } opacity-80`} />
            
            <div className="relative flex items-center gap-4">
              <div className={`p-4 rounded-xl border ${
                profitPercentage >= 0 
                  ? 'bg-emerald-500/20 border-emerald-500/30' 
                  : 'bg-rose-500/20 border-rose-500/30'
              }`}>
                <Activity className={`w-8 h-8 ${
                  profitPercentage >= 0 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-rose-600 dark:text-rose-400'
                }`} />
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm text-muted-foreground font-medium">Margin Profit</p>
                {isKasirMode ? (
                  <p className="text-3xl md:text-4xl text-muted-foreground blur-sm select-none">
                    ••••%
                  </p>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <p className={`text-3xl md:text-4xl ${
                      profitPercentage >= 0 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {profitPercentage >= 0 ? '+' : ''}{profitPercentage.toFixed(1)}%
                    </p>
                    {profitPercentage >= 0 ? (
                      <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Floating button removed - moved to page header */}
    </div>
  )
}