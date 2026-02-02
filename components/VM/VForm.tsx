// OriginalName: VendorForm
// ShortName: VForm

import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Card } from '../ui/card'
import { X } from 'lucide-react'
import type { Vendor } from '../../types/inventory'

interface VFormProps {
  vendor?: Vendor // If provided, edit mode
  onSubmit: (data: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

export function VForm({ vendor, onSubmit, onCancel }: VFormProps) {
  const [formData, setFormData] = useState({
    nama_vendor: '',
    kontak: '',
    email: '',
    alamat: '',
    catatan: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load vendor data if editing
  useEffect(() => {
    if (vendor) {
      setFormData({
        nama_vendor: vendor.nama_vendor,
        kontak: vendor.kontak || '',
        email: vendor.email || '',
        alamat: vendor.alamat || '',
        catatan: vendor.catatan || ''
      })
    }
  }, [vendor])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nama_vendor.trim()) {
      newErrors.nama_vendor = 'Nama vendor harus diisi'
    }

    // Validate email format if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    onSubmit(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium">
          {vendor ? 'Edit Vendor' : 'Tambah Vendor Baru'}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama Vendor */}
        <div>
          <Label htmlFor="nama_vendor">
            Nama Vendor <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nama_vendor"
            value={formData.nama_vendor}
            onChange={(e) => handleChange('nama_vendor', e.target.value)}
            placeholder="Contoh: PT Sparepart Jaya"
            className={errors.nama_vendor ? 'border-destructive' : ''}
          />
          {errors.nama_vendor && (
            <p className="text-sm text-destructive mt-1">{errors.nama_vendor}</p>
          )}
        </div>

        {/* Kontak */}
        <div>
          <Label htmlFor="kontak">Kontak / No. HP</Label>
          <Input
            id="kontak"
            value={formData.kontak}
            onChange={(e) => handleChange('kontak', e.target.value)}
            placeholder="0812-3456-7890"
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="vendor@example.com"
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email}</p>
          )}
        </div>

        {/* Alamat */}
        <div>
          <Label htmlFor="alamat">Alamat</Label>
          <Textarea
            id="alamat"
            value={formData.alamat}
            onChange={(e) => handleChange('alamat', e.target.value)}
            placeholder="Alamat lengkap vendor"
            rows={2}
          />
        </div>

        {/* Catatan */}
        <div>
          <Label htmlFor="catatan">Catatan</Label>
          <Textarea
            id="catatan"
            value={formData.catatan}
            onChange={(e) => handleChange('catatan', e.target.value)}
            placeholder="Catatan tambahan tentang vendor"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            {vendor ? 'Update Vendor' : 'Tambah Vendor'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
        </div>
      </form>
    </Card>
  )
}
