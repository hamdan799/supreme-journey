// OriginalName: MasterData
// ShortName: Master

import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import BHPList from './BHP/List'

export function Master() {
  useDocumentTitle('Master Brand HP')

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl">Master Brand HP</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola brand HP untuk form service & observasi AI
          </p>
        </div>
      </div>

      {/* Brand HP List - Mode B: Model HP ada di background, auto-recorded */}
      <BHPList />
    </div>
  )
}

export default Master