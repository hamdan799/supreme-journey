// OriginalName: ProductStatistics
// ShortName: ProdStats

import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Package, AlertCircle, TrendingUp, Box } from 'lucide-react'
import type { Product, Category } from '../../../types/inventory'

interface ProdStatsProps {
  products: Product[]
  categories: Category[]
}

export default function ProdStats({ products, categories }: ProdStatsProps) {
  // Calculate stats
  const totalProducts = products.length

  const totalStock = products.reduce((sum, p) => 
    sum + (p.stock_qty ?? p.stock ?? 0), 0
  )

  const totalStockValue = products.reduce((sum, p) => {
    const stock = p.stock_qty ?? p.stock ?? 0
    const price = p.selling_price ?? p.price ?? 0
    return sum + (stock * price)
  }, 0)

  const lowStockProducts = products.filter(p => {
    const stock = p.stock_qty ?? p.stock ?? 0
    const minStock = p.min_stock_alert ?? p.minStock ?? 0
    return stock <= minStock
  }).length

  const universalProducts = products.filter(p => p.is_universal).length

  const productsWithCompatibility = products.filter(p => 
    (p.compatible_brands && p.compatible_brands.length > 0) ||
    (p.compatible_models && p.compatible_models.length > 0) ||
    (p.custom_model_raw && p.custom_model_raw.length > 0)
  ).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Total Produk</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            {categories.length} kategori
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Total Stok</CardTitle>
          <Box className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{totalStock.toLocaleString('id-ID')}</div>
          <p className="text-xs text-muted-foreground">
            unit tersedia
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Nilai Stok</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl">Rp {(totalStockValue / 1000000).toFixed(1)}jt</div>
          <p className="text-xs text-muted-foreground">
            nilai total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Stok Rendah</CardTitle>
          <AlertCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-destructive">{lowStockProducts}</div>
          <p className="text-xs text-muted-foreground">
            produk perlu restok
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Kompatibilitas HP</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl">{universalProducts}</div>
              <p className="text-xs text-muted-foreground">produk universal</p>
            </div>
            <div>
              <div className="text-2xl">{productsWithCompatibility}</div>
              <p className="text-xs text-muted-foreground">dengan kompatibilitas HP</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}