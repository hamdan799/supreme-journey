// OriginalName: ProductSparepartList
// ShortName: ProdList

import { useState } from 'react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { Search, Plus, Edit, Trash2, Package, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import ProdForm from './Form'
import ProdStats from './Stats'
import type { Product, Category, Contact } from '../../../types/inventory'

interface ProdListProps {
  products: Product[]
  categories: Category[]
  contacts: Contact[]
  onProductCreate: (product: Product) => void
  onProductUpdate: (id: string, updates: Partial<Product>) => void
  onProductDelete: (productId: string) => void
}

export default function ProdList({
  products,
  categories,
  contacts,
  onProductCreate,
  onProductUpdate,
  onProductDelete,
}: ProdListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchCategory = selectedCategory === 'all' || 
      p.category_id === selectedCategory || 
      p.categoryId === selectedCategory
    
    return matchSearch && matchCategory
  })

  const handleAdd = () => {
    setEditingProduct(null)
    setIsFormOpen(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleDelete = (product: Product) => {
    if (confirm(`Hapus produk "${product.name}"?`)) {
      onProductDelete(product.id)
      toast.success('Produk berhasil dihapus')
    }
  }

  const handleSubmit = (product: Product) => {
    if (editingProduct) {
      onProductUpdate(product.id, product)
      toast.success('Produk berhasil diupdate')
    } else {
      onProductCreate(product)
      toast.success('Produk berhasil ditambahkan')
    }
  }

  // Get stock for product (backward compatibility)
  const getStock = (p: Product) => p.stock_qty ?? p.stock ?? 0
  const getMinStock = (p: Product) => p.min_stock_alert ?? p.minStock ?? 0

  return (
    <div className="space-y-4">
      {/* Stats */}
      <ProdStats products={products} categories={categories} />

      {/* Filters & Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle>Daftar Produk</CardTitle>
              <CardDescription>Kelola produk sparepart dengan kompatibilitas HP</CardDescription>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search & Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari produk, SKU, catatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Belum ada produk</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead className="text-right">Harga Jual</TableHead>
                    <TableHead className="text-center">Stok</TableHead>
                    <TableHead>Kompatibilitas</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map(product => {
                    const stock = getStock(product)
                    const minStock = getMinStock(product)
                    const isLowStock = stock <= minStock

                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            {product.sku && (
                              <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                            )}
                            {product.notes && (
                              <p className="text-xs text-muted-foreground italic mt-1">
                                {product.notes.substring(0, 50)}
                                {product.notes.length > 50 && '...'}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          {product.brand_sparepart || (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          Rp {(product.selling_price || product.price || 0).toLocaleString('id-ID')}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className={isLowStock ? 'text-destructive' : ''}>
                              {stock}
                            </span>
                            {isLowStock && (
                              <AlertCircle className="w-4 h-4 text-destructive" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {product.is_universal ? (
                              <Badge variant="secondary" className="text-xs">
                                Universal
                              </Badge>
                            ) : (
                              <>
                                {product.compatible_brands && product.compatible_brands.length > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    {product.compatible_brands.length} Brand
                                  </Badge>
                                )}
                                {product.compatible_models && product.compatible_models.length > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    {product.compatible_models.length} Model
                                  </Badge>
                                )}
                                {product.custom_model_raw && product.custom_model_raw.length > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    {product.custom_model_raw.length} Custom
                                  </Badge>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(product)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <ProdForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingProduct(null)
        }}
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
        categories={categories}
        contacts={contacts}
      />
    </div>
  )
}
