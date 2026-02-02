// OriginalName: VendorStats
// ShortName: VStats

import { Card } from '../ui/card'
import { Package, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import type { Vendor } from '../../types/inventory'

interface VStatsProps {
  vendors: Vendor[]
}

export function VStats({ vendors }: VStatsProps) {
  // Calculate statistics
  const totalVendors = vendors.length
  const vendorsWithContact = vendors.filter(v => v.kontak).length
  const vendorsWithEmail = vendors.filter(v => v.email).length
  const vendorsWithNotes = vendors.filter(v => v.catatan).length

  const stats = [
    {
      label: 'Total Vendor',
      value: totalVendors,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      label: 'Dengan Kontak',
      value: vendorsWithContact,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      label: 'Dengan Email',
      value: vendorsWithEmail,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      label: 'Dengan Catatan',
      value: vendorsWithNotes,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-medium">{stat.value}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
