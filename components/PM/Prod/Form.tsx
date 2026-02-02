// OriginalName: ProductSparepartForm
// ShortName: ProdForm

/**
 * 🔷 BLUEPRINT: KOMPATIBILITAS AI MODE
 * 
 * Kompatibilitas TIDAK DI-INPUT MANUAL, hanya ditampilkan (read-only).
 * Kompatibilitas dihitung otomatis dari riwayat pemakaian di nota service.
 */

import { useState, useEffect } from 'react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { Badge } from '../../ui/badge'
import { Info } from 'lucide-react'
import { toast } from 'sonner'
import { useBrandSparepart } from '../../../hooks/useBrandSparepart'
import { useCompatibilityTracker } from '../../../hooks/useCompatibilityTracker'
import { useBrandHP } from '../../../hooks/useBrandHP'
import type { Product, Category, Contact } from '../../../types/inventory'

interface ProdFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (product: Product) => void
  editingProduct?: Product | null
  categories: Category[]
  contacts: Contact[]
}

export default function ProdForm({
  isOpen,
  onClose,
  editingProduct,
  onSubmit,
  categories,
  contacts,
}: ProdFormProps) {
  const { activeBrands: sparepartBrands } = useBrandSparepart()
  const { getCompatibilityHints } = useCompatibilityTracker()
  const { activeBrands: phoneBrands } = useBrandHP()

  // 🔷 Sentinel values untuk optional selects (Radix tidak boleh value="")
  const NONE_BRAND_SPAREPART = '__none_brand_sparepart__'
  const NONE_HELPER_BRAND = '__none_helper_brand__'

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    brand_sparepart_id: NONE_BRAND_SPAREPART,  // Default to sentinel value
    purchase_price: 0,
    selling_price: 0,
    stock_qty: 0,
    min_stock_alert: 5,
    helper_brand_hp: NONE_HELPER_BRAND,  // Default to sentinel value
    helper_model_text: '',
    notes: '',
    sku: '',
  })

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        category_id: editingProduct.category_id || editingProduct.categoryId || '',
        brand_sparepart_id: editingProduct.brand_sparepart_id || NONE_BRAND_SPAREPART,
        purchase_price: editingProduct.purchase_price || editingProduct.cost || 0,
        selling_price: editingProduct.selling_price || editingProduct.price || 0,
        stock_qty: editingProduct.stock_qty || editingProduct.stock || 0,
        min_stock_alert: editingProduct.min_stock_alert || editingProduct.minStock || 5,
        helper_brand_hp: editingProduct.helper_brand_hp || NONE_HELPER_BRAND,
        helper_model_text: editingProduct.helper_model_text || '',
        notes: editingProduct.notes || '',
        sku: editingProduct.sku || '',
      })
    } else {
      resetForm()
    }
  }, [editingProduct, isOpen])

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category_id: '',
      brand_sparepart_id: NONE_BRAND_SPAREPART,  // Default to sentinel value
      purchase_price: 0,
      selling_price: 0,
      stock_qty: 0,
      min_stock_alert: 5,
      helper_brand_hp: NONE_HELPER_BRAND,  // Default to sentinel value
      helper_model_text: '',
      notes: '',
      sku: '',
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Nama produk wajib diisi')
      return
    }

    if (!formData.category_id) {
      toast.error('Kategori wajib dipilih')
      return
    }

    const product: Product = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: categories.find(c => c.id === formData.category_id)?.name || '',
      category_id: formData.category_id,
      categoryId: formData.category_id,
      brand_sparepart_id: formData.brand_sparepart_id === NONE_BRAND_SPAREPART ? null : formData.brand_sparepart_id,
      brand_sparepart: sparepartBrands.find(b => b.id === formData.brand_sparepart_id)?.name || null,
      purchase_price: formData.purchase_price,
      cost: formData.purchase_price, // Backward compatibility
      selling_price: formData.selling_price,
      price: formData.selling_price, // Backward compatibility
      stock_qty: formData.stock_qty,
      stock: formData.stock_qty, // Backward compatibility
      min_stock_alert: formData.min_stock_alert,
      minStock: formData.min_stock_alert, // Backward compatibility
      
      // 🟦 HELPER KOMPATIBILITAS (Operasional)
      helper_brand_hp: formData.helper_brand_hp === NONE_HELPER_BRAND ? null : formData.helper_brand_hp,
      helper_model_text: formData.helper_model_text.trim() || null,
      
      notes: formData.notes.trim(),
      sku: formData.sku || `SKU-${Date.now()}`,
      
      // 🔷 BLUEPRINT: Preserve compatibility_hint dari existing product
      compatibility_hint: editingProduct?.compatibility_hint || undefined,
      
      createdAt: editingProduct?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    onSubmit(product)
    onClose()
    resetForm()
  }

  // 🔷 BLUEPRINT: Get compatibility hints (read-only display)
  const compatibilityHints = editingProduct ? getCompatibilityHints(editingProduct.id) : []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? 'Edit Produk' : 'Tambah Produk Sparepart'}
          </DialogTitle>
          <DialogDescription>
            {editingProduct
              ? 'Update informasi produk sparepart'
              : 'Tambahkan produk sparepart baru dengan kompatibilitas HP'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1) INFORMASI DASAR */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-medium">Informasi Dasar</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>Nama Produk *</Label>
                <Input
                  placeholder="e.g., LCD Touchscreen, Flexible On/Off"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Kategori *</Label>
                <Select value={formData.category_id} onValueChange={(val) => setFormData({ ...formData, category_id: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* BLUEPRINT: Hanya tampilkan kategori aktif */}
                    {categories
                      .filter(cat => cat.is_active)
                      .map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Brand Sparepart (Opsional)</Label>
                <Select value={formData.brand_sparepart_id} onValueChange={(val) => setFormData({ ...formData, brand_sparepart_id: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_BRAND_SPAREPART}>Tanpa Brand</SelectItem>
                    {sparepartBrands.map(brand => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Deskripsi (Opsional)</Label>
                <Textarea
                  placeholder="Deskripsi produk..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* 2) HELPER KOMPATIBILITAS (OPERASIONAL - BUKAN AI) */}
          <div className="space-y-4 p-4 border rounded-lg bg-amber-50 dark:bg-amber-950/20">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-900 dark:text-amber-100">
                  🔍 Helper Kompatibilitas (untuk Search Cepat)
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Opsional. Isi jika ingin produk mudah dicari berdasarkan brand/model HP tertentu.
                  <br />
                  <span className="font-medium">Contoh:</span> Flexible Power untuk "Samsung A12/A13", LCD untuk "Universal Samsung A series"
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Brand HP (Opsional)</Label>
                <Select 
                  value={formData.helper_brand_hp} 
                  onValueChange={(val) => setFormData({ ...formData, helper_brand_hp: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih brand HP" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_HELPER_BRAND}>Tidak ada</SelectItem>
                    {phoneBrands.map(brand => (
                      <SelectItem key={brand.id} value={brand.name}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Brand HP yang sering pakai sparepart ini
                </p>
              </div>

              <div className="space-y-2">
                <Label>Model HP (Opsional)</Label>
                <Input
                  placeholder="e.g., A12, A12/A13, Universal Samsung"
                  value={formData.helper_model_text}
                  onChange={(e) => setFormData({ ...formData, helper_model_text: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Text bebas: A12, A12/A13, Universal, dll
                </p>
              </div>
            </div>

            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <span className="font-semibold">📌 Catatan:</span> Helper ini HANYA untuk mempermudah search & filter.
                Tidak dipakai untuk analisis AI atau laporan statistik.
              </p>
            </div>
          </div>

          {/* 3) KOMPATIBILITAS AI (READ-ONLY DISPLAY) - Hanya saat edit */}
          {editingProduct && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium">💡 Pola Pemakaian Terdeteksi</h3>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Data kompatibilitas dihitung otomatis dari riwayat pemakaian di nota service
              </p>

              {compatibilityHints.length > 0 ? (
                <div className="space-y-2">
                  {compatibilityHints.map((hint, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg bg-background">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-sm">
                          {hint.brand} {hint.model}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Dipakai {hint.usage_count}×
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-600">
                            {hint.confidence}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Confidence
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border rounded-lg bg-background text-center">
                  <Info className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Belum ada data kompatibilitas (menunggu observasi dari nota service)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 4) HARGA & STOK */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-medium">Harga & Stok</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Harga Modal</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.purchase_price}
                  onChange={(e) => setFormData({ ...formData, purchase_price: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label>Harga Jual *</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.selling_price}
                  onChange={(e) => setFormData({ ...formData, selling_price: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Stok Awal</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.stock_qty}
                  onChange={(e) => setFormData({ ...formData, stock_qty: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label>Minimal Stok Alert</Label>
                <Input
                  type="number"
                  placeholder="5"
                  value={formData.min_stock_alert}
                  onChange={(e) => setFormData({ ...formData, min_stock_alert: parseInt(e.target.value) || 5 })}
                />
              </div>
            </div>
          </div>

          {/* 5) CATATAN TEKNIS */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-medium">Catatan Teknis (Opsional)</h3>
            <Textarea
              placeholder="Contoh: LCD ini mudah pecah, Touch CPH1909 kompatibel ke CPH1923"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {editingProduct ? 'Update' : 'Tambah Produk'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}