// OriginalName: CategoryStatistics
// ShortName: CatStats

import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { LayoutGrid, CheckCircle2, XCircle, Package, AlertCircle } from 'lucide-react'
import type { Product, Category } from '../../../types/inventory'

interface CatStatsProps {
  products: Product[]
  categories: Category[]
}

export default function CatStats({ products, categories }: CatStatsProps) {
  // BLUEPRINT: Category Statistics with legacy data guard
  const getCategoryProductCount = (categoryId: string) => {
    return products.filter(p => 
      p.category_id === categoryId || p.categoryId === categoryId
    ).length
  }

  // Guard untuk legacy data dengan category (string name)
  const productsWithLegacyCategory = products.filter(p => 
    !p.category_id && !p.categoryId && p.category
  ).length

  const categoryStats = {
    total: categories.length,
    active: categories.filter(c => c.is_active).length,
    inactive: categories.filter(c => !c.is_active).length,
    empty: categories.filter(c => getCategoryProductCount(c.id) === 0).length,
    used: categories.filter(c => getCategoryProductCount(c.id) > 0).length
  }

  const totalProductsInCategories = products.filter(p => 
    p.category_id || p.categoryId
  ).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Total Kategori</CardTitle>
          <LayoutGrid className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{categoryStats.total}</div>
          <p className="text-xs text-muted-foreground">
            kategori terdaftar
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Kategori Aktif</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-green-600">{categoryStats.active}</div>
          <p className="text-xs text-muted-foreground">
            dapat dipilih di form
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Kategori Nonaktif</CardTitle>
          <XCircle className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-gray-400">{categoryStats.inactive}</div>
          <p className="text-xs text-muted-foreground">
            tidak muncul di dropdown
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Kategori Kosong</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-red-600">{categoryStats.empty}</div>
          <p className="text-xs text-muted-foreground">
            belum ada produk
          </p>
        </CardContent>
      </Card>

      {/* Kategori Terpakai */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Kategori Terpakai</CardTitle>
          <Package className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-blue-600">{categoryStats.used}</div>
          <p className="text-xs text-muted-foreground">
            {totalProductsInCategories} produk menggunakan kategori
          </p>
        </CardContent>
      </Card>

      {/* Warning untuk Legacy Data */}
      {productsWithLegacyCategory > 0 && (
        <Card className="md:col-span-2 border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-orange-700">Legacy Data Warning</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-orange-600">{productsWithLegacyCategory}</div>
            <p className="text-xs text-orange-700">
              produk menggunakan category (string). Perlu migrasi ke category_id.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
