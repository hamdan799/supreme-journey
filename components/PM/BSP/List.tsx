// OriginalName: BrandSparepartList
// ShortName: BSPList

import { useState } from 'react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { Plus, Search, Edit, Trash2, Tag, Power, PowerOff } from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import BSPForm from './Form'
import type { SparepartBrand, Product } from '../../../types/inventory'

interface BSPListProps {
  brands: SparepartBrand[]
  products: Product[]
  onBrandCreate: (brand: Omit<SparepartBrand, 'id' | 'created_at' | 'updated_at'>) => void
  onBrandUpdate: (id: string, updates: Partial<SparepartBrand>) => void
  onBrandDelete: (brandId: string) => void
}

export default function BSPList({
  brands,
  products,
  onBrandCreate,
  onBrandUpdate,
  onBrandDelete,
}: BSPListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTier, setSelectedTier] = useState<string>('all')
  const [showInactive, setShowInactive] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<SparepartBrand | null>(null)

  // BLUEPRINT: Filter brands
  const filteredBrands = brands.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchTier = selectedTier === 'all' || b.tier === selectedTier
    const matchActive = showInactive ? true : b.is_active
    return matchSearch && matchTier && matchActive
  })

  const handleAdd = () => {
    setEditingBrand(null)
    setIsFormOpen(true)
  }

  const handleEdit = (brand: SparepartBrand) => {
    setEditingBrand(brand)
    setIsFormOpen(true)
  }

  const handleDelete = (brand: SparepartBrand) => {
    // BLUEPRINT: Tidak boleh delete jika brand dipakai produk
    const usedInProducts = products.filter(p => 
      p.brand_sparepart_id === brand.id
    ).length

    if (usedInProducts > 0) {
      toast.error(
        `Brand ini digunakan oleh ${usedInProducts} produk. Nonaktifkan brand atau pindahkan produk terlebih dahulu.`,
        { duration: 5000 }
      )
      return
    }

    if (confirm(`Hapus brand "${brand.name}"?`)) {
      onBrandDelete(brand.id)
      toast.success('Brand berhasil dihapus')
    }
  }

  const handleToggleActive = (brand: SparepartBrand) => {
    const newStatus = !brand.is_active
    onBrandUpdate(brand.id, { is_active: newStatus })
    
    // BLUEPRINT: UX hint untuk toggle inactive
    if (!newStatus) {
      const productCount = getBrandProductCount(brand.id)
      toast.info(
        `Brand "${brand.name}" dinonaktifkan. ${productCount > 0 ? `${productCount} produk tetap ada, tapi` : ''} brand tidak muncul di dropdown form produk.`,
        { duration: 4000 }
      )
    } else {
      toast.success(`Brand "${brand.name}" diaktifkan kembali`)
    }
  }

  const handleSubmit = (brandData: Omit<SparepartBrand, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingBrand) {
      onBrandUpdate(editingBrand.id, brandData)
    } else {
      onBrandCreate(brandData)
    }
    setIsFormOpen(false)
    setEditingBrand(null)
  }

  const getBrandProductCount = (brandId: string) => {
    return products.filter(p => p.brand_sparepart_id === brandId).length
  }

  const stats = {
    total: brands.length,
    active: brands.filter(b => b.is_active).length,
    inactive: brands.filter(b => !b.is_active).length,
    neverUsed: brands.filter(b => getBrandProductCount(b.id) === 0).length
  }

  const getTierLabel = (tier: string) => {
    const labels: Record<string, string> = {
      ori: 'Original',
      oem: 'OEM',
      premium: 'Premium',
      kw: 'KW',
      unknown: 'Unknown',
    }
    return labels[tier] || tier
  }

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      ori: 'bg-purple-500',
      oem: 'bg-blue-500',
      premium: 'bg-green-500',
      kw: 'bg-orange-500',
      unknown: 'bg-gray-500',
    }
    return colors[tier] || 'bg-gray-500'
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle>Daftar Brand Sparepart</CardTitle>
              <CardDescription>
                Kelola brand sparepart (Vizz, iMax, OEM, dll). Brand nonaktif tidak muncul di form produk.
              </CardDescription>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant="outline">{stats.total} Total</Badge>
                <Badge variant="default">{stats.active} Aktif</Badge>
                <Badge variant="secondary">{stats.inactive} Nonaktif</Badge>
                <Badge variant="destructive">{stats.neverUsed} Tidak Terpakai</Badge>
              </div>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Brand
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tier</SelectItem>
                <SelectItem value="ori">Original</SelectItem>
                <SelectItem value="oem">OEM</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="kw">KW</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={showInactive ? 'default' : 'outline'}
              onClick={() => setShowInactive(!showInactive)}
            >
              {showInactive ? 'Semua' : 'Aktif Saja'}
            </Button>
          </div>

          {/* Brands Grid */}
          {filteredBrands.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Tag className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Belum ada brand sparepart</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBrands.map(brand => {
                const productCount = getBrandProductCount(brand.id)
                return (
                  <Card key={brand.id} className={!brand.is_active ? 'opacity-60' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <CardTitle className="text-base truncate">{brand.name}</CardTitle>
                            <Badge className={getTierColor(brand.tier)} variant="default">
                              {getTierLabel(brand.tier)}
                            </Badge>
                            {!brand.is_active && (
                              <Badge variant="secondary" className="text-xs">
                                Nonaktif
                              </Badge>
                            )}
                          </div>
                          {brand.description && (
                            <CardDescription className="text-xs line-clamp-2">
                              {brand.description}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {productCount} produk
                      </p>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(brand)}
                          className="flex-1"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(brand)}
                          title={brand.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {brand.is_active ? (
                            <Power className="w-3 h-3 text-green-600" />
                          ) : (
                            <PowerOff className="w-3 h-3 text-gray-400" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(brand)}
                          disabled={productCount > 0}
                          title={productCount > 0 ? 'Tidak bisa dihapus, masih digunakan' : 'Hapus'}
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <BSPForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingBrand(null)
        }}
        onSubmit={handleSubmit}
        editingBrand={editingBrand}
        existingBrands={brands}
      />
    </div>
  )
}