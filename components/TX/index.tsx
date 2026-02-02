// OriginalName: TX (Transactions)
// ShortName: TX

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { History } from './history'
import { Manual } from './Manual'
import { Stats } from './Stats'
import { Card, CardContent } from '../ui/card'
import { TrendingUp, ShoppingCart, DollarSign } from 'lucide-react'
import type { Transaction } from '../../types/financial'
import type { Product, StockLog, Receipt, Contact } from '../../types/inventory'

interface TXProps {
  transactions: Transaction[]
  products: Product[]
  receipts: Receipt[]
  contacts: Contact[]
  categories: any[]
  onTransactionCreate: (transaction: Transaction) => void
  onTransactionUpdate: (id: string, updates: Partial<Transaction>) => void
  onTransactionDelete: (transactionId: string) => void
  onReceiptCreate: (receipt: Receipt) => void
  onProductUpdate: (id: string, updates: Partial<Product>) => void
  onStockLogCreate: (log: StockLog) => void
  onContactCreate: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onCategoryCreate?: (category: any) => Promise<void>
  onProductCreate?: (product: any) => Promise<void>
  storeInfo: {
    storeName: string
    storeLogo: string
    storeAddress: string
    storePhone: string
    currency: string
  }
}

export function TX({ 
  transactions, 
  products,
  receipts,
  contacts,
  categories,
  onTransactionCreate,
  onTransactionUpdate,
  onTransactionDelete,
  onReceiptCreate,
  onProductUpdate,
  onStockLogCreate,
  onContactCreate,
  onCategoryCreate,
  onProductCreate,
  storeInfo
}: TXProps) {
  const [activeTab, setActiveTab] = useState('history')

  // Today's stats for quick panel
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const todayTransactions = transactions.filter(t => {
    const txDate = new Date(t.tanggal || t.createdAt)
    txDate.setHours(0, 0, 0, 0)
    return txDate.getTime() === today.getTime()
  })

  const todayStats = {
    count: todayTransactions.length,
    total: todayTransactions.reduce((sum, t) => sum + t.nominal, 0),
    average: todayTransactions.length > 0 
      ? todayTransactions.reduce((sum, t) => sum + t.nominal, 0) / todayTransactions.length 
      : 0
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Manajemen Transaksi</h1>
          <p className="text-muted-foreground">Riwayat transaksi dan statistik</p>
        </div>
      </div>

      {/* Quick Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transaksi Hari Ini</p>
                <p className="text-2xl font-bold">{todayStats.count}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Penjualan</p>
                <p className="text-2xl font-bold">{formatCurrency(todayStats.total)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rata-rata Transaksi</p>
                <p className="text-2xl font-bold">{formatCurrency(todayStats.average)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="history">Riwayat Transaksi</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <History
            transactions={transactions}
            storeInfo={storeInfo}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}