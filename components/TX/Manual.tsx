// OriginalName: ManualTransactionModule
// ShortName: Manual

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Plus, Calculator } from 'lucide-react'
import { TxDlg } from '../TxDlg'
import type { Transaction } from '../../types/financial'
import type { Product, Category, Contact } from '../../types/inventory'

interface ManualProps {
  onTransactionCreate: (transaction: Transaction) => void
  products?: Product[]
  categories?: Category[]
  contacts?: Contact[]
  onContactCreate?: (contact: any) => Promise<void>
  onCategoryCreate?: (category: any) => Promise<void>
  onProductCreate?: (product: any) => Promise<void>
  onProductUpdate?: (product: Product) => void
  onStockLogCreate?: (log: any) => void
}

export function Manual({ 
  onTransactionCreate,
  products = [],
  categories = [],
  contacts = [],
  onContactCreate,
  onCategoryCreate,
  onProductCreate,
  onProductUpdate,
  onStockLogCreate
}: ManualProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transaksi Manual</CardTitle>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Transaksi
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Gunakan tombol "Tambah Transaksi" untuk membuat transaksi manual</p>
        </div>
      </CardContent>

      <TxDlg
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        mode="manual"
        defaultTab="sale"
        products={products}
        categories={categories}
        contacts={contacts}
        onTransactionCreate={onTransactionCreate}
        onContactCreate={onContactCreate}
        onCategoryCreate={onCategoryCreate}
        onProductCreate={onProductCreate}
        onProductUpdate={onProductUpdate}
        onStockLogCreate={onStockLogCreate}
      />
    </Card>
  )
}
