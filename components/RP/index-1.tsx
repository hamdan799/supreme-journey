// OriginalName: RP (Reports)
// ShortName: RP

import { StockRpt } from './StockRpt'
import type { StockLog, Product, Category } from '../../types/inventory'

interface RPProps {
  products: Product[]
  stockLogs: StockLog[]
  categories: Category[]
  onStockLogUpdate?: (id: string, updates: Partial<StockLog>) => void
  onStockLogDelete?: (id: string) => void
}

export function RP({ 
  products, 
  stockLogs, 
  categories,
  onStockLogUpdate,
  onStockLogDelete 
}: RPProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Laporan Stock</h1>
        <p className="text-muted-foreground">Monitor pergerakan stock masuk dan keluar</p>
      </div>

      <StockRpt
        stockLogs={stockLogs}
        products={products}
        categories={categories}
        onStockLogUpdate={onStockLogUpdate}
        onStockLogDelete={onStockLogDelete}
      />
    </div>
  )
}