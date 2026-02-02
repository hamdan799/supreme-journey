// OriginalName: CategoryPage
// ShortName: Index

import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import CatList from './List'
import CatStats from './Stats'
import type { Category, Product } from '../../../types/inventory'

interface KategoriPageProps {
  products: Product[]
  categories: Category[]
  onCategoryCreate: (category: Category) => void
  onCategoryUpdate: (id: string, updates: Partial<Category>) => void
  onCategoryDelete: (categoryId: string) => void
}

export default function KategoriPage({
  products,
  categories,
  onCategoryCreate,
  onCategoryUpdate,
  onCategoryDelete
}: KategoriPageProps) {
  useDocumentTitle('Kategori')

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl">Kategori</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola kategori produk dan sparepart
          </p>
        </div>
      </div>

      {/* Stats */}
      <CatStats products={products} categories={categories} />

      {/* Category List */}
      <CatList
        products={products}
        categories={categories}
        onCategoryCreate={onCategoryCreate}
        onCategoryUpdate={onCategoryUpdate}
        onCategoryDelete={onCategoryDelete}
      />
    </div>
  )
}