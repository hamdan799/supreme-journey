export interface TransactionItem {
  id: string
  productId?: string         // Untuk referensi saja, JANGAN query ulang
  productName: string        // ✅ Snapshot nama
  quantity: number
  unitPrice: number          // ✅ Snapshot harga jual SAAT transaksi
  unitCost: number           // ✅ Snapshot modal SAAT transaksi (WAJIB, bukan optional)
  total: number              // unitPrice * quantity
  // Optional metadata for better reporting
  category?: string
  brand_hp?: string
  model_hp?: string
  sparepart_brand?: string
  vendor_name?: string
}

export interface Transaction {
  id: string
  transactionNumber?: string // Unique transaction ID
  type: 'pemasukan' | 'pengeluaran'
  items?: TransactionItem[] // Support multi-product
  nominal: number
  totalCost?: number
  profit?: number
  catatan?: string
  kategori?: string
  tanggal: Date
  customerName?: string
  customerPhone?: string
  customerId?: string // New: Link to Contact
  paymentStatus?: 'lunas' | 'hutang' | 'sebagian'
  paidAmount?: number
  dueDate?: Date // New: Due date for hutang
  storeId?: string
  userId?: string
  createdAt: Date
  updatedAt?: Date
  createdBy?: string // For multi-user support
  createdByRole?: 'owner' | 'kasir' // New: Track who created
}

export interface Debt {
  id: string
  customerName: string
  customerPhone?: string
  customerId?: string // New: Link to Contact
  totalDebt: number
  dueDate?: Date
  transactions: DebtTransaction[]
  debtType: 'terima' | 'memberi' // New: Direction of debt
  storeId?: string
  userId?: string
  status?: 'active' | 'settled'
  settledAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface DebtTransaction {
  id: string
  debtId: string
  type: 'memberi' | 'bayar' | 'terima' // New: Added 'terima'
  amount: number
  catatan?: string
  tanggal: Date
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface FinancialSummary {
  totalRevenue: number
  totalExpenses: number
  totalProfit: number
  totalDebt: number
  period: string
}