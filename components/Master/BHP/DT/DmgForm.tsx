// OriginalName: DamageTypeForm
// ShortName: DmgForm

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import type { DamageType } from '../../../types/nota';

interface DamageFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  damage?: DamageType | null;
  onSubmit: (data: Partial<DamageType>) => void;
}

const DAMAGE_CATEGORIES = [
  'Hardware',
  'Software',
  'Physical',
  'Battery',
  'Display',
  'Audio',
  'Network',
  'Lainnya'
];

export function DmgForm({ open, onOpenChange, damage, onSubmit }: DamageFormProps) {
  const [formData, setFormData] = useState<Partial<DamageType>>({
    name: '',
    description: '',
    category: 'Hardware'
  });

  useEffect(() => {
    if (damage) {
      setFormData({
        name: damage.name,
        description: damage.description,
        category: damage.category
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'Hardware'
      });
    }
  }, [damage, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {damage ? 'Edit Jenis Kerusakan' : 'Tambah Jenis Kerusakan'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Kerusakan *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., LCD Pecah, Flexible Mati"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAMAGE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Deskripsi tambahan (opsional)"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">
              {damage ? 'Update' : 'Tambah'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
