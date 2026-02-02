// OriginalName: BrandSparepartPage
// ShortName: Index

import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import BSPList from './List'
import BSPStats from './Stats'
import type { SparepartBrand, Product } from '../../../types/inventory'

interface BrandSparepartPageProps {
  products: Product[]
  brands: SparepartBrand[]
  onBrandCreate: (brand: SparepartBrand) => void
  onBrandUpdate: (id: string, updates: Partial<SparepartBrand>) => void
  onBrandDelete: (brandId: string) => void
}

export default function BrandSparepartPage({
  products,
  brands,
  onBrandCreate,
  onBrandUpdate,
  onBrandDelete
}: BrandSparepartPageProps) {
  useDocumentTitle('Brand Sparepart')

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl">Brand Sparepart</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola brand sparepart (Vizz, iMax, OEM, Original, dll)
          </p>
        </div>
      </div>

      {/* Stats */}
      <BSPStats products={products} brands={brands} />

      {/* Brand List */}
      <BSPList
        products={products}
        brands={brands}
        onBrandCreate={onBrandCreate}
        onBrandUpdate={onBrandUpdate}
        onBrandDelete={onBrandDelete}
      />
    </div>
  )
}
