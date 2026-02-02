// OriginalName: DamageTypePage
// ShortName: DTPage

import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { DamageType } from './index'
import type { DamageType as DamageTypeModel } from '../../../types/nota'

interface DTPageProps {
  damageTypes: DamageTypeModel[]
  onDamageCreate: (damage: Partial<DamageTypeModel>) => void
  onDamageUpdate: (id: string, updates: Partial<DamageTypeModel>) => void
  onDamageDelete: (id: string) => void
}

export function DTPage({
  damageTypes,
  onDamageCreate,
  onDamageUpdate,
  onDamageDelete
}: DTPageProps) {
  useDocumentTitle('Jenis Kerusakan')

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl">Jenis Kerusakan</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola daftar jenis kerusakan HP untuk mempermudah input service
          </p>
        </div>
      </div>

      {/* Damage Type Content */}
      <DamageType
        damageTypes={damageTypes}
        onDamageCreate={onDamageCreate}
        onDamageUpdate={onDamageUpdate}
        onDamageDelete={onDamageDelete}
      />
    </div>
  )
}

export default DTPage
