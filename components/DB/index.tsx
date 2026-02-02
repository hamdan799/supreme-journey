// OriginalName: DB (Dashboard)
// ShortName: DB

import { useState } from 'react'
import { DashboardSummaryCard } from './Summary'
import { QuickStats } from './QS'
import { AddTx } from './AddTx'
import type { StockLog, Receipt, Category, Product, Contact } from '../../types/inventory'
import type { Transaction } from '../../types/financial'

interface DBProps {
  stockLogs: StockLog[]
  receipts: Receipt[]
  transactions: Transaction[]
  categories: Category[]
  products: Product[]
  contacts: Contact[]
  onStockLogCreate: (log: any) => Promise<void>
  onReceiptCreate: (receipt: any) => Promise<void>
  onTransactionCreate: (transaction: any) => Promise<void>
  onProductUpdate: (product: Product) => Promise<void>
  onContactCreate: (contact: any) => Promise<void>
  onCategoryCreate?: (category: any) => Promise<void>
  onProductCreate?: (product: any) => Promise<void>
  onNavigateToAnalysis: (filter: 'sale' | 'expense') => void
  onNavigateToProduct?: () => void
  storeInfo: {
    storeName: string
    storeLogo: string
    storeAddress: string
    storePhone: string
    currency: string
  }
}

export function DB({ 
  stockLogs, 
  receipts, 
  transactions, 
  categories, 
  products, 
  contacts, 
  onStockLogCreate, 
  onReceiptCreate, 
  onTransactionCreate, 
  onProductUpdate, 
  onContactCreate,
  onCategoryCreate,
  onProductCreate,
  onNavigateToAnalysis,
  onNavigateToProduct,
  storeInfo 
}: DBProps) {
  const [showAddTransaction, setShowAddTransaction] = useState(false)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground">Ringkasan bisnis Anda hari ini</p>
        </div>
        <button
          onClick={() => setShowAddTransaction(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-[14px]"
        >
          <span className="text-lg">+</span>
          <span>Transaksi</span>
        </button>
      </div>

      {/* Summary Cards: Penjualan, Pengeluaran, Profit, Margin */}
      <DashboardSummaryCard
        transactions={transactions}
        products={products}
        onNavigateToAnalysis={onNavigateToAnalysis}
        onNavigateToProduct={onNavigateToProduct}
        onAddTransaction={() => setShowAddTransaction(true)}
      />
      
      {/* Quick Stats: Grafik 7 hari, Transaksi terbaru (3), Stok kritis (3) */}
      <QuickStats 
        transactions={transactions}
        products={products}
        onNavigateToProduct={onNavigateToProduct}
      />

      <AddTx
        open={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        products={products}
        categories={categories}
        contacts={contacts}
        onTransactionCreate={onTransactionCreate}
        onStockLogCreate={onStockLogCreate}
        onProductUpdate={onProductUpdate}
        onContactCreate={onContactCreate}
        onCategoryCreate={onCategoryCreate}
        onProductCreate={onProductCreate}
      />
    </div>
  )
}
