// ==========================================
// POSProductPanel.tsx — PRODUCT SEARCH & SELECTION UI
// ==========================================
// Komponen UI untuk panel kiri POS:
// - Barcode scanner
// - Popular products
// - Recent products
// ==========================================

import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Badge } from '../../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible'
import { Scan, Star, Clock, ChevronDown } from 'lucide-react'
import type { Product } from '../../../types/inventory'

// ==========================================
// PROPS
// ==========================================

interface POSProductPanelProps {
  // Barcode search
  barcode: string
  onBarcodeChange: (value: string) => void
  onBarcodeSearch: () => void

  // Products
  popularProducts: Product[]
  recentProducts: Product[]

  // Actions
  onProductClick: (product: Product) => void

  // UI state
  showPopular: boolean
  onShowPopularChange: (value: boolean) => void
  showRecent: boolean
  onShowRecentChange: (value: boolean) => void

  // Helper
  formatCurrency: (amount: number) => string
}

// ==========================================
// COMPONENT
// ==========================================

export function POSProductPanel({
  barcode,
  onBarcodeChange,
  onBarcodeSearch,
  popularProducts,
  recentProducts,
  onProductClick,
  showPopular,
  onShowPopularChange,
  showRecent,
  onShowRecentChange,
  formatCurrency,
}: POSProductPanelProps) {
  return (
    <div className="space-y-4">
      {/* Barcode Scanner */}
      <Card>
        <CardContent className="p-4">
          <Label>Scan Barcode / Cari Produk</Label>
          <div className="flex gap-2 mt-2">
            <div className="relative flex-1">
              <Scan className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Scan atau ketik barcode/nama produk..."
                value={barcode}
                onChange={(e) => onBarcodeChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onBarcodeSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={onBarcodeSearch}>
              Cari
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Popular Items */}
      <Collapsible open={showPopular} onOpenChange={onShowPopularChange}>
        <Card>
          <CardHeader className="pb-3">
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <CardTitle className="text-base">Produk Populer</CardTitle>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showPopular ? 'rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {popularProducts.map(product => (
                  <Button
                    key={product.id}
                    variant="outline"
                    className="h-auto flex flex-col items-start p-3"
                    onClick={() => onProductClick(product)}
                  >
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(product.price)}
                    </div>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Stok: {product.stock}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Recent Items */}
      {recentProducts.length > 0 && (
        <Collapsible open={showRecent} onOpenChange={onShowRecentChange}>
          <Card>
            <CardHeader className="pb-3">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <CardTitle className="text-base">Terakhir Digunakan</CardTitle>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showRecent ? 'rotate-180' : ''}`} />
                </div>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {recentProducts.map(product => (
                    <Button
                      key={product.id}
                      variant="outline"
                      className="h-auto flex flex-col items-start p-3"
                      onClick={() => onProductClick(product)}
                    >
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(product.price)}
                      </div>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        Stok: {product.stock}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </div>
  )
}
