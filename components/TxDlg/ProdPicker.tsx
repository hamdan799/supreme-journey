// OriginalName: ProductPicker
// ShortName: ProdPicker

import { useState } from 'react';
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
import { Search, Package, Plus, Minus, FolderPlus, PackagePlus } from 'lucide-react';
import { QuickCategoryForm } from './QuickCategoryForm';
import { QuickProductForm } from './QuickProductForm';
import type { Product, Category } from '../../types/inventory';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  cost: number;
  quantity: number;
  stock: number;
}

interface ProdPickerProps {
  products: Product[];
  categories: Category[];
  cartItems: CartItem[];
  searchQuery: string;
  selectedCategory: string;
  onSearchChange: (query: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  formatCurrency: (amount: number) => string;
  onCategoryCreate?: (data: { name: string; description: string }) => Promise<void>;
  onProductCreate?: (data: any) => Promise<void>;
}

export function ProdPicker({
  products,
  categories,
  cartItems,
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onAddToCart,
  onUpdateQuantity,
  formatCurrency,
  onCategoryCreate,
  onProductCreate,
}: ProdPickerProps) {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || p.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCategoryCreate = async (data: { name: string; description: string }) => {
    if (onCategoryCreate) {
      await onCategoryCreate(data);
      setShowCategoryForm(false);
    }
  };

  const handleProductCreate = async (data: any) => {
    if (onProductCreate) {
      await onProductCreate(data);
      setShowProductForm(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Create Buttons */}
      {(onCategoryCreate || onProductCreate) && (
        <div className="flex gap-2">
          {onCategoryCreate && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCategoryForm(true)}
              className="flex-1"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              Kategori
            </Button>
          )}
          {onProductCreate && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowProductForm(true)}
              className="flex-1"
            >
              <PackagePlus className="w-4 h-4 mr-2" />
              Produk
            </Button>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label>Kategori</Label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Cari Produk</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Nama atau SKU..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-2 max-h-[280px] overflow-y-auto border rounded-lg p-2">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Tidak ada produk</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const inCart = cartItems.find((item) => item.productId === product.id);
            return (
              <div
                key={product.id}
                className="flex flex-col gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* Product Info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>Stok: {product.stock}</span>
                      <span>•</span>
                      <span>{formatCurrency(product.price)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end">
                  {!inCart ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="w-full sm:w-auto px-[10px] py-[0px] text-[12px]"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Tambah ke Keranjang
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(product.id, inCart.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="min-w-[3rem] text-center text-sm font-medium">
                        {inCart.quantity}
                      </span>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(product.id, inCart.quantity + 1)}
                        disabled={inCart.quantity >= product.stock}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Forms */}
      {onCategoryCreate && (
        <QuickCategoryForm
          open={showCategoryForm}
          onClose={() => setShowCategoryForm(false)}
          onSubmit={handleCategoryCreate}
        />
      )}
      {onProductCreate && (
        <QuickProductForm
          open={showProductForm}
          onClose={() => setShowProductForm(false)}
          onSubmit={handleProductCreate}
          categories={categories}
        />
      )}
    </div>
  );
}