// ==========================================
// POSCartPanel.tsx — CART & CHECKOUT UI
// ==========================================
// Komponen UI untuk panel kanan POS:
// - Cart items display
// - Quantity controls
// - Discount & premium
// - Totals calculation
// - Customer info
// - Action buttons
// ==========================================

import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Separator } from '../../ui/separator'
import { ShoppingCart, Plus, Minus, Trash2, Save, DollarSign, Contact as ContactIcon } from 'lucide-react'
import type { Product, Contact } from '../../../types/inventory'

// ==========================================
// TYPES
// ==========================================

interface CartItem {
  productId: string
  quantity: number
}

interface Cart {
  id: string
  name: string
  items: CartItem[]
}

interface CartItemWithData extends CartItem {
  product: Product
}

// ==========================================
// PROPS
// ==========================================

interface POSCartPanelProps {
  // Cart state
  carts: Cart[]
  activeCartId: string
  onActiveCartChange: (cartId: string) => void

  // Cart items with product data
  cartItems: CartItemWithData[]

  // Pricing
  subtotal: number
  discount: number | ''
  onDiscountChange: (value: number | '') => void
  premi: number | ''
  onPremiChange: (value: number | '') => void
  total: number

  // Customer
  customerName: string
  onCustomerNameChange: (value: string) => void
  customerPhone: string
  onCustomerPhoneChange: (value: string) => void
  customerContacts: Contact[]
  onContactSelect: (contactId: string) => void

  // Cart operations
  onQuantityUpdate: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void

  // Actions
  onHold: () => void
  onClear: () => void
  onCheckout: () => void

  // Helper
  formatCurrency: (amount: number) => string
}

// ==========================================
// COMPONENT
// ==========================================

export function POSCartPanel({
  carts,
  activeCartId,
  onActiveCartChange,
  cartItems,
  subtotal,
  discount,
  onDiscountChange,
  premi,
  onPremiChange,
  total,
  customerName,
  onCustomerNameChange,
  customerPhone,
  onCustomerPhoneChange,
  customerContacts,
  onContactSelect,
  onQuantityUpdate,
  onRemoveItem,
  onHold,
  onClear,
  onCheckout,
  formatCurrency,
}: POSCartPanelProps) {
  const activeCart = carts.find(c => c.id === activeCartId) || carts[0]

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Keranjang Aktif</CardTitle>
          {carts.length > 1 && (
            <Select value={activeCartId} onValueChange={onActiveCartChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {carts.map(cart => (
                  <SelectItem key={cart.id} value={cart.id}>
                    {cart.name}
                    {cart.items.length > 0 && ` (${cart.items.length})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-2 max-h-[400px] overflow-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Keranjang kosong</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.productId} className="flex items-start gap-2 p-2 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.product.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(item.product.price)} x {item.quantity}
                  </div>
                  <div className="font-medium text-sm mt-1">
                    {formatCurrency(item.product.price * item.quantity)}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => onQuantityUpdate(item.productId, item.quantity - 1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <div className="w-8 text-center text-sm">{item.quantity}</div>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => onQuantityUpdate(item.productId, item.quantity + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive"
                    onClick={() => onRemoveItem(item.productId)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm flex-shrink-0">Diskon:</Label>
            <Input
              type="number"
              value={discount}
              onChange={(e) => onDiscountChange(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="0"
              className="h-8"
              min="0"
              max={subtotal}
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm flex-shrink-0">Tambahan:</Label>
            <Input
              type="number"
              value={premi}
              onChange={(e) => onPremiChange(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="0"
              className="h-8"
              min="0"
            />
          </div>

          <Separator />

          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-2">
          {customerContacts.length > 0 && (
            <Select onValueChange={onContactSelect}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Pilih dari kontak" />
              </SelectTrigger>
              <SelectContent>
                {customerContacts.map(contact => (
                  <SelectItem key={contact.id} value={contact.id}>
                    <div className="flex items-center gap-2">
                      <ContactIcon className="w-4 h-4" />
                      <span>{contact.name}</span>
                      {contact.phone && (
                        <span className="text-xs text-muted-foreground">
                          ({contact.phone})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Input
            placeholder="Nama customer (opsional)"
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
          />
          <Input
            placeholder="No. telepon (opsional)"
            value={customerPhone}
            onChange={(e) => onCustomerPhoneChange(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onHold}
          >
            <Save className="w-4 h-4 mr-1" />
            Hold
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            disabled={activeCart.items.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
          <Button
            size="sm"
            onClick={onCheckout}
            disabled={activeCart.items.length === 0}
            className="col-span-1"
          >
            <DollarSign className="w-4 h-4 mr-1" />
            Bayar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
