// OriginalName: ReportsPage
// ShortName: Reports

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { AdvReports } from './AdvReports'
import { ExportEngine } from './ExportEngine'
import type { Transaction } from '../../types/financial'
import type { Product } from '../../types/inventory'

interface ReportsProps {
  transactions: Transaction[]
  products: Product[]
}

export function Reports({ transactions, products }: ReportsProps) {
  const [activeTab, setActiveTab] = useState('builder')
  const [dateRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Business Reports</h1>
        <p className="text-muted-foreground">
          Generate, export, dan manage comprehensive business reports
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="export">Export Center</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="mt-6">
          <AdvReports
            transactions={transactions}
            products={products}
          />
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <ExportEngine
            data={{
              transactions,
              products,
              dateRange
            }}
            reportType="general"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
