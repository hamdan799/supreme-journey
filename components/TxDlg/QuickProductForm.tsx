// OriginalName: QuickProductForm
// ShortName: QProdForm

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Category } from '../../types/inventory';

interface QuickProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  categories: Category[];
}

export function QuickProductForm({
  open,
  onClose,
  onSubmit,
  categories,
}: QuickProductFormProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Nama produk wajib diisi');
      return;
    }

    if (!categoryId) {
      toast.error('Kategori wajib dipilih');
      return;
    }

    if (!price || Number(price) <= 0) {
      toast.error('Harga jual wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const selectedCategory = categories.find(c => c.id === categoryId);
      await onSubmit({
        name: name.trim(),
        categoryId,
        category: selectedCategory?.name || '',
        price: Number(price),
        cost: cost ? Number(cost) : 0,
        stock: stock ? Number(stock) : 0,
        sku: sku.trim() || undefined,
      });
      toast.success('Produk berhasil ditambahkan');
      handleClose();
    } catch (error) {
      toast.error('Gagal menambahkan produk');
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setCategoryId('');
    setPrice('');
    setCost('');
    setStock('');
    setSku('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah Produk Baru</DialogTitle>
          <DialogDescription>
            Produk akan langsung tersimpan di Product Management
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="product-name">
                Nama Produk <span className="text-destructive">*</span>
              </Label>
              <Input
                id="product-name"
                placeholder="Contoh: Samsung A52"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="product-category">
                Kategori <span className="text-destructive">*</span>
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger id="product-category">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.length === 0 ? (
                    <SelectItem value="no-category" disabled>
                      Belum ada kategori
                    </SelectItem>
                  ) : (
                    categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-price">
                Harga Jual <span className="text-destructive">*</span>
              </Label>
              <Input
                id="product-price"
                type="number"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="any"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-cost">Modal (opsional)</Label>
              <Input
                id="product-cost"
                type="number"
                placeholder="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                min="0"
                step="any"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-stock">Stok Awal (opsional)</Label>
              <Input
                id="product-stock"
                type="number"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-sku">SKU (opsional)</Label>
              <Input
                id="product-sku"
                placeholder="A001"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}