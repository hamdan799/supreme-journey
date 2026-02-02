// OriginalName: BrandHPPage
// ShortName: BrandHPPage

import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import BHPList from './List'

export default function BrandHPPage() {
  useDocumentTitle('Brand HP')

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl">Brand HP</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola brand handphone untuk sistem kompatibilitas
          </p>
        </div>
      </div>

      {/* Brand HP List */}
      <BHPList />
    </div>
  )
}