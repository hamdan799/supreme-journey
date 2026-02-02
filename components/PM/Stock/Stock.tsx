// OriginalName: StockManagementPage
// ShortName: Index

import { useState, useMemo } from 'react'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { Input } from '../../ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import {
  Package,
  Plus,
  Search,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertTriangle,
  Settings,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Product, StockLog, Contact } from '../../../types/inventory'
import { useStockLedger } from '../../../hooks/useStockLedger'
import { StockDialog } from './StockDialog'

interface KelolaStokPageProps {
  products: Product[]
  stockLogs: StockLog[]
  contacts: Contact[]
  onProductUpdate: (id: string, updates: Partial<Product>) => void
  onStockLogCreate: (log: StockLog) => void
}

export default function KelolaStokPage({
  products,
  stockLogs,
  contacts,
  onProductUpdate,
  onStockLogCreate
}: KelolaStokPageProps) {
  useDocumentTitle('Kelola Stok')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'low' | 'out'>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // 🆕 BLUEPRINT: useStockLedger Hook
  const stockLedger = useStockLedger(products, onProductUpdate)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const status = stockLedger.getStockStatus(product.id)
      
      // Filter by stock status
      if (filterType === 'low' && status.status !== 'low') return false
      if (filterType === 'out' && status.status !== 'out') return false
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = product.name.toLowerCase().includes(query)
        const matchesSku = product.sku?.toLowerCase().includes(query)
        if (!matchesName && !matchesSku) return false
      }
      
      return true
    })
  }, [products, searchQuery, filterType, stockLedger])

  // Calculate stats
  const stats = useMemo(() => {
    const lowStock = products.filter(p => {
      const status = stockLedger.getStockStatus(p.id)
      return status.status === 'low'
    }).length
    
    const outOfStock = products.filter(p => {
      const status = stockLedger.getStockStatus(p.id)
      return status.status === 'out'
    }).length
    
    const totalValue = products.reduce((sum, p) => {
      const status = stockLedger.getStockStatus(p.id)
      const cost = p.cost ?? p.purchase_price ?? 0
      return sum + (cost * status.total)
    }, 0)
    
    return { lowStock, outOfStock, totalValue }
  }, [products, stockLedger])

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl">Kelola Stok</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Sistem stok berbasis event ledger (Stock Ledger)
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm">Stok Menipis</CardTitle>
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">Produk perlu restock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm">Habis</CardTitle>
            <Package className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">Produk habis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm">Nilai Total Stok</CardTitle>
            <ArrowUpCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">Modal tersimpan</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="low">Stok Menipis</SelectItem>
            <SelectItem value="out">Habis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product Stock Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Stok Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Tersedia</TableHead>
                  <TableHead className="text-right">Reserve</TableHead>
                  <TableHead className="text-right">Modal/Unit</TableHead>
                  <TableHead className="text-right">Total Nilai</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Tidak ada produk</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map(product => {
                    const status = stockLedger.getStockStatus(product.id)
                    const cost = product.cost ?? product.purchase_price ?? 0
                    const totalValue = cost * status.total

                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <div>{product.name}</div>
                            {product.description && (
                              <div className="text-xs text-muted-foreground">
                                {product.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.sku && (
                            <Badge variant="outline">{product.sku}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{status.total}</TableCell>
                        <TableCell className="text-right text-green-600">
                          {status.available}
                        </TableCell>
                        <TableCell className="text-right text-blue-600">
                          {status.reserved}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(cost)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(totalValue)}
                        </TableCell>
                        <TableCell>
                          {status.status === 'out' ? (
                            <Badge variant="destructive">Habis</Badge>
                          ) : status.status === 'low' ? (
                            <Badge className="bg-orange-500">Menipis</Badge>
                          ) : (
                            <Badge className="bg-green-500">Aman</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <Settings className="w-4 h-4 mr-1" />
                            Kelola
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Stock Dialog */}
      {selectedProduct && (
        <StockDialog
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
          product={selectedProduct}
          stockStatus={stockLedger.getStockStatus(selectedProduct.id)}
          ledgers={stockLedger.getLedgersByProduct(selectedProduct.id)}
          onStockIn={(qty, note) => {
            stockLedger.recordStockIn(selectedProduct.id, qty, 'purchase', undefined, note)
          }}
          onStockOut={(qty, note) => {
            stockLedger.recordStockOut(selectedProduct.id, qty, 'correction', undefined, note)
          }}
          onAdjustment={(qtyAfter, reason, note) => {
            stockLedger.recordAdjustment(selectedProduct.id, qtyAfter, reason, note)
          }}
        />
      )}
    </div>
  )
}