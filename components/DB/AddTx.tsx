// OriginalName: EnhancedAddTransaction
// ShortName: AddTx
// Wrapper component that uses the unified TxDlg

import { TxDlg } from '../TxDlg'
import type {
  Product,
  Category,
  Contact,
} from '../../types/inventory'

interface EnhancedAddTransactionProps {
  open: boolean
  onClose: () => void
  products: Product[]
  categories: Category[]
  contacts: Contact[]
  onTransactionCreate: (transaction: any) => void
  onStockLogCreate: (log: any) => void
  onProductUpdate: (product: Product) => void
  onContactCreate?: (contact: any) => Promise<void>
  onCategoryCreate?: (category: any) => Promise<void>
  onProductCreate?: (product: any) => Promise<void>
}

export function AddTx({
  open,
  onClose,
  products,
  categories,
  contacts,
  onTransactionCreate,
  onStockLogCreate,
  onProductUpdate,
  onContactCreate,
  onCategoryCreate,
  onProductCreate,
}: EnhancedAddTransactionProps) {
  return (
    <TxDlg
      open={open}
      onClose={onClose}
      mode="dashboard"
      defaultTab="sale"
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
  )
}
