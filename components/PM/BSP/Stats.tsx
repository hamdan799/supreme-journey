// OriginalName: BrandSparepartStatistics
// ShortName: BSPStats

import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Tag, CheckCircle2, XCircle, Package, Box } from 'lucide-react'
import type { Product, SparepartBrand } from '../../../types/inventory'

interface BSPStatsProps {
  products: Product[]
  brands: SparepartBrand[]
}

export default function BSPStats({ products, brands }: BSPStatsProps) {
  // BLUEPRINT: Brand Sparepart Statistics
  const getBrandProductCount = (brandId: string) => {
    return products.filter(p => 
      p.brand_sparepart_id === brandId
    ).length
  }

  const brandStats = {
    total: brands.length,
    active: brands.filter(b => b.is_active).length,
    inactive: brands.filter(b => !b.is_active).length,
    used: brands.filter(b => getBrandProductCount(b.id) > 0).length,
    neverUsed: brands.filter(b => getBrandProductCount(b.id) === 0).length
  }

  const tierStats = {
    ori: brands.filter(b => b.tier === 'ori').length,
    oem: brands.filter(b => b.tier === 'oem').length,
    premium: brands.filter(b => b.tier === 'premium').length,
    kw: brands.filter(b => b.tier === 'kw').length,
    unknown: brands.filter(b => b.tier === 'unknown').length
  }

  const totalProductsWithBrand = products.filter(p => p.brand_sparepart_id).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Total Brand</CardTitle>
          <Tag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{brandStats.total}</div>
          <p className="text-xs text-muted-foreground">
            brand terdaftar
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Brand Aktif</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-green-600">{brandStats.active}</div>
          <p className="text-xs text-muted-foreground">
            dapat dipilih di form
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Brand Nonaktif</CardTitle>
          <XCircle className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-gray-400">{brandStats.inactive}</div>
          <p className="text-xs text-muted-foreground">
            tidak muncul di dropdown
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Brand Tidak Terpakai</CardTitle>
          <Box className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-orange-600">{brandStats.neverUsed}</div>
          <p className="text-xs text-muted-foreground">
            belum ada produk
          </p>
        </CardContent>
      </Card>

      {/* Brand Terpakai */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Brand Terpakai</CardTitle>
          <Package className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-blue-600">{brandStats.used}</div>
          <p className="text-xs text-muted-foreground">
            {totalProductsWithBrand} produk menggunakan brand
          </p>
        </CardContent>
      </Card>

      {/* Tier Distribution */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Distribusi Tier</CardTitle>
          <Tag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Original:</span>
              <span className="font-medium text-purple-600">{tierStats.ori}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">OEM:</span>
              <span className="font-medium text-blue-600">{tierStats.oem}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Premium:</span>
              <span className="font-medium text-green-600">{tierStats.premium}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">KW:</span>
              <span className="font-medium text-orange-600">{tierStats.kw}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Unknown:</span>
              <span className="font-medium text-gray-600">{tierStats.unknown}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}