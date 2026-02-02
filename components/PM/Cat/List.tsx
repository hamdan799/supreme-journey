// OriginalName: CategoryList
// ShortName: CatList

import { useState } from 'react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Plus, Search, Edit, Trash2, LayoutGrid, Power, PowerOff } from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import CatForm from './Form'
import type { Category, Product } from '../../../types/inventory'

interface CatListProps {
  categories: Category[]
  products: Product[]
  onCategoryCreate: (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => void
  onCategoryUpdate: (id: string, updates: Partial<Category>) => void
  onCategoryDelete: (categoryId: string) => void
}

export default function CatList({
  categories,
  products,
  onCategoryCreate,
  onCategoryUpdate,
  onCategoryDelete,
}: CatListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showInactive, setShowInactive] = useState(true)

  const filteredCategories = categories.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchActive = showInactive ? true : c.is_active
    return matchSearch && matchActive
  })

  const handleAdd = () => {
    setEditingCategory(null)
    setIsFormOpen(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  const handleDelete = (category: Category) => {
    // BLUEPRINT: Guard untuk legacy data dengan category (string name)
    // Cek produk dengan category_id atau categoryId (normal)
    const productsWithCategoryId = products.filter(p => 
      p.category_id === category.id || p.categoryId === category.id
    ).length

    // Cek produk dengan category (string name) - legacy data
    const productsWithCategoryName = products.filter(p => 
      !p.category_id && !p.categoryId && p.category === category.name
    ).length

    const usedInProducts = productsWithCategoryId + productsWithCategoryName

    if (usedInProducts > 0) {
      toast.error(
        `Kategori ini digunakan oleh ${usedInProducts} produk${productsWithCategoryName > 0 ? ` (${productsWithCategoryName} legacy data)` : ''}. Nonaktifkan kategori atau pindahkan produk terlebih dahulu.`,
        { duration: 5000 }
      )
      return
    }

    if (confirm(`Hapus kategori "${category.name}"?`)) {
      onCategoryDelete(category.id)
      toast.success('Kategori berhasil dihapus')
    }
  }

  const handleToggleActive = (category: Category) => {
    const newStatus = !category.is_active
    onCategoryUpdate(category.id, { is_active: newStatus })
    
    // BLUEPRINT: UX hint untuk toggle inactive
    if (!newStatus) {
      const productCount = getCategoryProductCount(category.id)
      toast.info(
        `Kategori "${category.name}" dinonaktifkan. ${productCount > 0 ? `${productCount} produk tetap ada, tapi` : ''} kategori tidak muncul di dropdown form produk.`,
        { duration: 4000 }
      )
    } else {
      toast.success(`Kategori "${category.name}" diaktifkan kembali`)
    }
  }

  const handleSubmit = (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingCategory) {
      onCategoryUpdate(editingCategory.id, categoryData)
    } else {
      onCategoryCreate(categoryData)
    }
    setIsFormOpen(false)
    setEditingCategory(null)
  }

  const getCategoryProductCount = (categoryId: string) => {
    return products.filter(p => 
      p.category_id === categoryId || p.categoryId === categoryId
    ).length
  }

  const stats = {
    total: categories.length,
    active: categories.filter(c => c.is_active).length,
    inactive: categories.filter(c => !c.is_active).length,
    empty: categories.filter(c => getCategoryProductCount(c.id) === 0).length
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle>Daftar Kategori</CardTitle>
              <CardDescription>
                Kelola kategori produk sparepart. Kategori nonaktif tidak muncul di form produk.
              </CardDescription>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant="outline">{stats.total} Total</Badge>
                <Badge variant="default">{stats.active} Aktif</Badge>
                <Badge variant="secondary">{stats.inactive} Nonaktif</Badge>
                <Badge variant="destructive">{stats.empty} Kosong</Badge>
              </div>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kategori
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search & Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showInactive ? 'default' : 'outline'}
              onClick={() => setShowInactive(!showInactive)}
            >
              {showInactive ? 'Semua' : 'Aktif Saja'}
            </Button>
          </div>

          {/* Categories Grid */}
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <LayoutGrid className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Belum ada kategori</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map(category => {
                const productCount = getCategoryProductCount(category.id)
                return (
                  <Card key={category.id} className={!category.is_active ? 'opacity-60' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-base truncate">{category.name}</CardTitle>
                            {!category.is_active && (
                              <Badge variant="secondary" className="text-xs">
                                Nonaktif
                              </Badge>
                            )}
                          </div>
                          {category.description && (
                            <CardDescription className="text-xs line-clamp-2">
                              {category.description}
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
                          onClick={() => handleEdit(category)}
                          className="flex-1"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(category)}
                          title={category.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {category.is_active ? (
                            <Power className="w-3 h-3 text-green-600" />
                          ) : (
                            <PowerOff className="w-3 h-3 text-gray-400" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(category)}
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
      <CatForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingCategory(null)
        }}
        onSubmit={handleSubmit}
        editingCategory={editingCategory}
        existingCategories={categories}
      />
    </div>
  )
}