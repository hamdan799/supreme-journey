// OriginalName: ProductSparepartPage
// ShortName: Index

import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import ProdList from './List'
import type { Category, Product, Contact } from '../../../types/inventory'

interface ProdukPageProps {
  products: Product[]
  categories: Category[]
  contacts: Contact[]
  onProductCreate: (product: Product) => void
  onProductUpdate: (id: string, updates: Partial<Product>) => void
  onProductDelete: (productId: string) => void
}

export default function ProdukPage({
  products,
  categories,
  contacts,
  onProductCreate,
  onProductUpdate,
  onProductDelete
}: ProdukPageProps) {
  useDocumentTitle('Produk (Sparepart)')

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl">Produk (Sparepart)</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola produk sparepart dengan kompatibilitas HP
          </p>
        </div>
      </div>

      {/* Product List */}
      <ProdList
        products={products}
        categories={categories}
        contacts={contacts}
        onProductCreate={onProductCreate}
        onProductUpdate={onProductUpdate}
        onProductDelete={onProductDelete}
      />
    </div>
  )
}