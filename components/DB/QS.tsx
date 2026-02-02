// OriginalName: QuickStats
// ShortName: QS

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { 
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { Button } from '../ui/button'
import type { Product } from '../../types/inventory'
import type { Transaction } from '../../types/financial'

interface QSProps {
  transactions: Transaction[]
  products: Product[]
  onNavigateToProduct?: () => void
}

export function QuickStats({ transactions, products, onNavigateToProduct }: QSProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Get last 7 days transactions for mini chart
  const last7Days = useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      
      const dayTransactions = transactions.filter(t => {
        const tDate = new Date(t.tanggal || t.createdAt)
        return tDate >= date && tDate < nextDate && t.type === 'pemasukan'
      })
      
      const total = dayTransactions.reduce((sum, t) => sum + t.nominal, 0)
      
      days.push({
        date: date.toLocaleDateString('id-ID', { weekday: 'short' }),
        total,
        count: dayTransactions.length
      })
    }
    return days
  }, [transactions])

  const maxValue = Math.max(...last7Days.map(d => d.total), 1)

  // Get last 3 transactions
  const recentTransactions = useMemo(() => {
    return transactions
      .sort((a, b) => 
        new Date(b.tanggal || b.createdAt).getTime() - 
        new Date(a.tanggal || a.createdAt).getTime()
      )
      .slice(0, 3)
  }, [transactions])

  // Get critical stock items (only 3)
  const criticalStock = useMemo(() => {
    return products
      .filter(p => p.stock <= (p.minStock || 0))
      .slice(0, 3)
  }, [products])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Mini Chart - 7 Days Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-4 h-4" />
            Tren 7 Hari
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-1 h-32">
            {last7Days.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex-1 w-full flex items-end justify-center">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t hover:from-emerald-600 hover:to-emerald-500 transition-all cursor-pointer relative group"
                    style={{ 
                      height: `${(day.total / maxValue) * 100}%`,
                      minHeight: day.total > 0 ? '8px' : '2px'
                    }}
                    title={`${day.date}: ${formatCurrency(day.total)}`}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {formatCurrency(day.total)}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{day.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions - Last 3 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="w-4 h-4" />
            Transaksi Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Belum ada transaksi
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between p-2 rounded-lg border hover:bg-accent transition-colors">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      transaction.type === 'pemasukan' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {transaction.customerName || 'Customer'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(transaction.tanggal || transaction.createdAt).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-semibold flex-shrink-0 ${
                    transaction.type === 'pemasukan' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'pemasukan' ? '+' : '-'}
                    {formatCurrency(transaction.nominal).replace('Rp', '').trim()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Critical Stock - Top 3 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="w-4 h-4" />
            Stok Kritis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {criticalStock.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Semua stok aman</p>
            </div>
          ) : (
            <div className="space-y-3">
              {criticalStock.map(product => (
                <div 
                  key={product.id} 
                  onClick={onNavigateToProduct}
                  className="flex items-center justify-between p-2 rounded-lg border border-orange-200 dark:border-orange-800 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Stok: {product.stock} unit
                    </div>
                  </div>
                  <Badge variant="destructive" className="text-xs flex-shrink-0">
                    Rendah
                  </Badge>
                </div>
              ))}
              {products.filter(p => p.stock <= (p.minStock || 0)).length > 3 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={onNavigateToProduct}
                >
                  Lihat semua ({products.filter(p => p.stock <= (p.minStock || 0)).length})
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
