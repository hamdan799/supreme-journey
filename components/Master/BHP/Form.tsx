// OriginalName: BrandHPForm
// ShortName: BHPForm

/**
 * 🔷 BLUEPRINT: MASTER BRAND HP FORM
 * 
 * Form untuk create/edit Brand HP
 * - Name (wajib, unique case-insensitive)
 * - Notes (opsional)
 * - is_active (soft-disable)
 */

import { useState, useEffect } from 'react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'
import { Switch } from '../../ui/switch'
import { Badge } from '../../ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import { toast } from 'sonner'
import type { PhoneBrand } from '../../../types/inventory'

interface BHPFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; notes?: string; is_active: boolean }) => void
  editingBrand?: PhoneBrand | null
}

export default function BHPForm({
  isOpen,
  onClose,
  editingBrand,
  onSubmit,
}: BHPFormProps) {
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (editingBrand) {
      setName(editingBrand.name || '')
      setNotes(editingBrand.notes || '')
      setIsActive(editingBrand.is_active ?? true)
    } else {
      setName('')
      setNotes('')
      setIsActive(true)
    }
  }, [editingBrand, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Nama brand wajib diisi')
      return
    }

    onSubmit({
      name: name.trim(),
      notes: notes.trim() || undefined,
      is_active: isActive,
    })
    
    onClose()
    setName('')
    setNotes('')
    setIsActive(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editingBrand ? 'Edit Brand HP' : 'Tambah Brand HP'}
            {editingBrand && !editingBrand.is_active && (
              <Badge variant="destructive" className="text-xs">Nonaktif</Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {editingBrand
              ? 'Update nama brand HP'
              : 'Tambahkan brand HP baru (Samsung, Xiaomi, Oppo, dll)'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Brand *</Label>
            <Input
              placeholder="e.g., Samsung, Xiaomi, Oppo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Catatan (Opsional)</Label>
            <Textarea
              placeholder="Catatan internal tentang brand ini..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label>Status Aktif</Label>
              <p className="text-xs text-muted-foreground">
                Brand nonaktif tidak muncul di dropdown nota service
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {editingBrand ? 'Update' : 'Tambah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}