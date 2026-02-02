// OriginalName: ContactStats
// ShortName: CTStats

import { Card } from '../ui/card'
import { Users, TrendingUp, Package } from 'lucide-react'
import type { Contact } from '../../types/inventory'

interface CTStatsProps {
  contacts: Contact[]
}

export function CTStats({ contacts }: CTStatsProps) {
  const stats = {
    total: contacts.length,
    customers: contacts.filter(c => c.type === 'customer' || c.type === 'both').length,
    suppliers: contacts.filter(c => c.type === 'supplier' || c.type === 'both').length,
    both: contacts.filter(c => c.type === 'both').length
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Kontak</p>
            <p className="text-2xl font-semibold mt-1">{stats.total}</p>
          </div>
          <Users className="w-8 h-8 text-blue-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Pelanggan</p>
            <p className="text-2xl font-semibold mt-1">{stats.customers}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-green-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Supplier</p>
            <p className="text-2xl font-semibold mt-1">{stats.suppliers}</p>
          </div>
          <Package className="w-8 h-8 text-orange-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Keduanya</p>
            <p className="text-2xl font-semibold mt-1">{stats.both}</p>
          </div>
          <Users className="w-8 h-8 text-purple-500" />
        </div>
      </Card>
    </div>
  )
}
