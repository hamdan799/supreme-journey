// OriginalName: ContactForm
// ShortName: CTForm

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import type { Contact } from '../../types/inventory'

interface CTFormProps {
  isOpen: boolean
  onClose: () => void
  contact: Contact | null
  onSubmit: (data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
}

export function CTForm({ isOpen, onClose, contact, onSubmit }: CTFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    type: 'customer' as 'customer' | 'supplier' | 'vendor' | 'both',
    notes: ''
  })

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        phone: contact.phone || '',
        email: contact.email || '',
        address: contact.address || '',
        type: contact.type,
        notes: contact.notes || ''
      })
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        type: 'customer',
        notes: ''
      })
    }
  }, [contact, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {contact ? 'Edit Kontak' : 'Tambah Kontak'}
          </DialogTitle>
          <DialogDescription>
            {contact 
              ? 'Perbarui informasi kontak' 
              : 'Tambahkan pelanggan atau supplier baru'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masukkan nama"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Tipe Kontak *</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: any) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Pelanggan</SelectItem>
                <SelectItem value="supplier">Supplier</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="both">Pelanggan & Supplier</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telepon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="08xx-xxxx-xxxx"
                type="tel"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                type="email"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Alamat</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Alamat lengkap"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Catatan tambahan (opsional)"
              rows={2}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {contact ? 'Perbarui' : 'Tambah'} Kontak
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
