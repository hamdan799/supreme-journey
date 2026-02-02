// OriginalName: CartView
// ShortName: CartView

import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { ShoppingCart, Trash2 } from 'lucide-react';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  cost: number;
  quantity: number;
  stock: number;
}

interface CartViewProps {
  items: CartItem[];
  onRemove: (productId: string) => void;
  formatCurrency: (amount: number) => string;
}

export function CartView({ items, onRemove, formatCurrency }: CartViewProps) {
  const totalSale = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCost = items.reduce((sum, item) => sum + item.cost * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Keranjang kosong</p>
        <p className="text-xs mt-1">Tambahkan produk dari daftar</p>
      </div>
    );
  }

  return (
    <>
      {items.map((item, index) => (
        <div
          key={item.productId}
          className="flex items-start justify-between p-3 border rounded bg-card"
        >
          <div className="flex-1">
            <p className="text-sm">
              {index + 1}. {item.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.quantity}x @ {formatCurrency(item.price)} ={' '}
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-destructive"
            onClick={() => onRemove(item.productId)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ))}
      <Separator className="my-3" />
      <div className="space-y-2 p-3 bg-primary/5 rounded-lg">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>{formatCurrency(totalSale)}</span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Total Modal:</span>
          <span>{formatCurrency(totalCost)}</span>
        </div>
      </div>
    </>
  );
}
