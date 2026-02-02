// OriginalName: StockReportPage
// ShortName: Index

import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { StockRpt } from '../../RP/StockRpt'
import type { Product, StockLog, Category } from '../../../types/inventory'

interface LaporanStokPageProps {
  products: Product[]
  categories: Category[]
  stockLogs: StockLog[]
}

export default function LaporanStokPage({
  products,
  categories,
  stockLogs
}: LaporanStokPageProps) {
  useDocumentTitle('Laporan Stok')

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl">Laporan Stok</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Laporan pergerakan stok dan analisis inventory
          </p>
        </div>
      </div>

      {/* Stock Report */}
      <StockRpt
        products={products}
        categories={categories}
        stockLogs={stockLogs}
      />
    </div>
  )
}