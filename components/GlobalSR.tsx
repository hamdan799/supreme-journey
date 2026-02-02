// OriginalName: GlobalSearchResults
// ShortName: GlobalSR

import { useState } from 'react'
import { Package, CreditCard, Tag, X, Search } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Button } from './ui/button'
import type { Product, Category } from '../types/inventory'
import type { Transaction } from '../types/financial'

interface SearchResults {
  products: Product[]
  transactions: Transaction[]
  categories: Category[]
}

interface GlobalSearchResultsProps {
  isOpen: boolean
  onClose: () => void
  query: string
  results: SearchResults
  onProductSelect?: (product: Product) => void
  onTransactionSelect?: (transaction: Transaction) => void
  onCategorySelect?: (category: Category) => void
}

export function GlobalSearchResults({
  isOpen,
  onClose,
  query,
  results,
  onProductSelect,
  onTransactionSelect,
  onCategorySelect
}: GlobalSearchResultsProps) {
  const totalResults = results.products.length + results.transactions.length + results.categories.length

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 rounded px-1">
          {part}
        </mark>
      ) : part
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Hasil Pencarian: "{query}"
            <Badge variant="secondary" className="ml-auto">
              {totalResults} hasil
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Menampilkan hasil pencarian untuk "{query}".
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6 pb-6">
          {totalResults === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Tidak ada hasil untuk "{query}"</p>
              <p className="text-sm mt-2">Coba kata kunci yang berbeda</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Products */}
              {results.products.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-blue-600" />
                    <h3 className="font-medium">Produk ({results.products.length})</h3>
                  </div>
                  <div className="space-y-2">
                    {results.products.map((product) => (
                      <div
                        key={product.id}
                        className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => onProductSelect?.(product)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">
                              {highlightText(product.name, query)}
                            </p>
                            {product.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {highlightText(product.description, query)}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>SKU: {highlightText(product.sku || '', query)}</span>
                              <span>Stok: {product.stock}</span>
                              <span>Harga: {formatCurrency(product.price)}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="ml-4">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transactions */}
              {results.transactions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-4 h-4 text-green-600" />
                    <h3 className="font-medium">Transaksi ({results.transactions.length})</h3>
                  </div>
                  <div className="space-y-2">
                    {results.transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => onTransactionSelect?.(transaction)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">
                              {highlightText(transaction.transactionNumber || `TRX-${transaction.id?.slice(0, 8)}`, query)}
                            </p>
                            {transaction.customerName && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Pelanggan: {highlightText(transaction.customerName, query)}
                              </p>
                            )}
                            {transaction.catatan && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {highlightText(transaction.catatan, query)}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>{formatDate(transaction.date)}</span>
                              <span>Total: {formatCurrency(transaction.total)}</span>
                            </div>
                          </div>
                          <Badge 
                            variant={transaction.type === 'sale' ? 'default' : 'secondary'}
                            className="ml-4"
                          >
                            {transaction.type === 'sale' ? 'Penjualan' : 'Pembelian'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {results.categories.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-purple-600" />
                    <h3 className="font-medium">Kategori ({results.categories.length})</h3>
                  </div>
                  <div className="space-y-2">
                    {results.categories.map((category) => (
                      <div
                        key={category.id}
                        className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => onCategorySelect?.(category)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">
                              {highlightText(category.name, query)}
                            </p>
                            {category.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {highlightText(category.description, query)}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline" className="ml-4">
                            Kategori
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t bg-muted/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Tekan ESC untuk menutup</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 px-3"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
