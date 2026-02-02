// OriginalName: BrandSparepartForm
// ShortName: BSPForm

import { useState, useEffect } from 'react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'
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
import { Switch } from '../../ui/switch'
import { Badge } from '../../ui/badge'
import { toast } from 'sonner@2.0.3'
import type { SparepartBrand } from '../../../types/inventory'

interface BSPFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (brand: Omit<SparepartBrand, 'id' | 'created_at' | 'updated_at'>) => void
  editingBrand: SparepartBrand | null
  existingBrands: SparepartBrand[]
}

export default function BSPForm({
  isOpen,
  onClose,
  onSubmit,
  editingBrand,
  existingBrands,
}: BSPFormProps) {
  const [formData, setFormData] = useState<Omit<SparepartBrand, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    description: null,
    tier: 'unknown',
    is_active: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingBrand) {
      setFormData({
        name: editingBrand.name,
        description: editingBrand.description,
        tier: editingBrand.tier,
        is_active: editingBrand.is_active,
      })
    } else {
      setFormData({
        name: '',
        description: null,
        tier: 'unknown',
        is_active: true,
      })
    }
    setErrors({})
  }, [editingBrand, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // BLUEPRINT: Validasi nama tidak boleh kosong
    const trimmedName = formData.name.trim()
    if (!trimmedName) {
      newErrors.name = 'Nama brand wajib diisi'
    }

    // BLUEPRINT: Validasi duplikasi nama (case-insensitive)
    if (trimmedName) {
      const isDuplicate = existingBrands.some(
        b =>
          b.name.toLowerCase() === trimmedName.toLowerCase() &&
          b.id !== editingBrand?.id
      )
      if (isDuplicate) {
        newErrors.name = 'Nama brand sudah ada (tidak boleh duplikasi)'
      }
    }

    // BLUEPRINT: Tier harus valid
    const validTiers = ['ori', 'oem', 'premium', 'kw', 'unknown']
    if (!validTiers.includes(formData.tier)) {
      newErrors.tier = 'Tier tidak valid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Mohon perbaiki error pada form')
      return
    }

    // BLUEPRINT: Trim whitespace sebelum submit
    const cleanedData = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description?.trim() || null,
    }

    onSubmit(cleanedData)
    onClose() // Let parent handle closing
  }

  const handleCancel = () => {
    // Explicit cancel - safe to reset
    onClose()
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
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingBrand ? 'Edit Brand Sparepart' : 'Tambah Brand Sparepart'}
            {editingBrand && !editingBrand.is_active && (
              <Badge variant="secondary" className="ml-2">Nonaktif</Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {editingBrand
              ? 'Ubah informasi brand sparepart'
              : 'Tambah brand sparepart baru (Vizz, iMax, OEM, dll)'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Brand */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nama Brand <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Vizz, iMax, M-Tri, OEM"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Tier */}
          <div className="space-y-2">
            <Label htmlFor="tier">
              Tier Kualitas <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.tier}
              onValueChange={(value: 'ori' | 'oem' | 'premium' | 'kw' | 'unknown') => 
                setFormData({ ...formData, tier: value })
              }
            >
              <SelectTrigger className={errors.tier ? 'border-destructive' : ''}>
                <SelectValue placeholder="Pilih tier kualitas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ori">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getTierColor('ori')}`} />
                    Original
                  </div>
                </SelectItem>
                <SelectItem value="oem">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getTierColor('oem')}`} />
                    OEM
                  </div>
                </SelectItem>
                <SelectItem value="premium">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getTierColor('premium')}`} />
                    Premium
                  </div>
                </SelectItem>
                <SelectItem value="kw">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getTierColor('kw')}`} />
                    KW
                  </div>
                </SelectItem>
                <SelectItem value="unknown">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getTierColor('unknown')}`} />
                    Unknown
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.tier && (
              <p className="text-xs text-destructive">{errors.tier}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Tier digunakan untuk filter kualitas sparepart
            </p>
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value || null })
              }
              placeholder="Catatan tentang brand ini..."
              rows={3}
            />
          </div>

          {/* Status Aktif */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Status Aktif</Label>
              <p className="text-xs text-muted-foreground">
                Brand nonaktif tidak muncul di form produk
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Batal
            </Button>
            <Button type="submit">
              {editingBrand ? 'Simpan Perubahan' : 'Tambah Brand'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}