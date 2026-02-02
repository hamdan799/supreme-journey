// OriginalName: CategoryForm
// ShortName: CatForm

import { useState, useEffect } from 'react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'
import { Switch } from '../../ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import { toast } from 'sonner@2.0.3'
import type { Category } from '../../../types/inventory'

interface CatFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => void
  editingCategory?: Category | null
  existingCategories?: Category[]
}

export default function CatForm({
  isOpen,
  onClose,
  editingCategory,
  onSubmit,
  existingCategories = []
}: CatFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true
  })

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name || '',
        description: editingCategory.description || '',
        is_active: editingCategory.is_active !== false
      })
    } else {
      resetForm()
    }
  }, [editingCategory, isOpen])

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      is_active: true
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Nama kategori wajib diisi')
      return
    }

    // Check duplicate (case insensitive)
    const duplicate = existingCategories.find(
      c => c.id !== editingCategory?.id && 
      c.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
    )
    if (duplicate) {
      toast.error('Nama kategori sudah digunakan')
      return
    }

    const categoryData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      is_active: formData.is_active
    }

    onSubmit(categoryData)
    onClose()
    resetForm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
          </DialogTitle>
          <DialogDescription>
            {editingCategory
              ? 'Update informasi kategori'
              : 'Tambahkan kategori baru untuk produk sparepart'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Kategori *</Label>
            <Input
              placeholder="e.g., LCD, Flexible, Battery"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Deskripsi (Opsional)</Label>
            <Textarea
              placeholder="Deskripsi kategori..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-0.5">
              <Label>Status Aktif</Label>
              <p className="text-sm text-muted-foreground">
                Kategori nonaktif tidak muncul di dropdown
              </p>
            </div>
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {editingCategory ? 'Update' : 'Tambah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}