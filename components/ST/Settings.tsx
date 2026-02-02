// OriginalName: EnhancedSettings
// ShortName: Settings

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import {
  Store,
  Users,
  Database,
  Bell,
  Palette,
  Zap
} from 'lucide-react'
import { BizTab } from './BizTab'
import { UserMgmt } from './UserMgmt'
import { BackTab } from './BackTab'
import { NotifTab } from './NotifTab'
import { AppTab } from './AppTab'
import { AutoTab } from './AutoTab'
import type { Product, Category, Contact, StockLog, Receipt } from '../../types/inventory'
import type { Transaction } from '../../types/financial'

interface SettingsProps {
  storeInfo: {
    storeName: string
    storeLogo: string
    storeAddress: string
    storePhone: string
    currency: string
  }
  onStoreInfoUpdate: (info: any) => void
  isDarkMode: boolean
  onThemeChange: (isDark: boolean) => void
  products: Product[]
  categories: Category[]
  transactions: Transaction[]
  stockLogs: StockLog[]
  receipts: Receipt[]
  contacts: Contact[]
  onDataImport: (data: any) => void
  onDataReset: () => void
}

export function Settings({
  storeInfo,
  onStoreInfoUpdate,
  isDarkMode,
  onThemeChange,
  products,
  categories,
  transactions,
  stockLogs,
  receipts,
  contacts,
  onDataImport,
  onDataReset
}: SettingsProps) {
  const [activeTab, setActiveTab] = useState('business')

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Pengaturan</h2>
        <p className="text-muted-foreground">
          Kelola profil bisnis, pengguna, dan konfigurasi sistem
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="business">
            <Store className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Bisnis</span>
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Pengguna</span>
          </TabsTrigger>
          <TabsTrigger value="backup">
            <Database className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Backup</span>
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Notifikasi</span>
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Tampilan</span>
          </TabsTrigger>
          <TabsTrigger value="automation">
            <Zap className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Otomasi</span>
          </TabsTrigger>
        </TabsList>

        {/* Business Profile */}
        <TabsContent value="business" className="space-y-6">
          <BizTab
            storeInfo={storeInfo}
            onStoreInfoUpdate={onStoreInfoUpdate}
          />
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <UserMgmt />
        </TabsContent>

        {/* Backup & Restore */}
        <TabsContent value="backup" className="space-y-6">
          <BackTab
            products={products}
            categories={categories}
            transactions={transactions}
            stockLogs={stockLogs}
            receipts={receipts}
            contacts={contacts}
            storeInfo={storeInfo}
            onDataImport={onDataImport}
            onDataReset={onDataReset}
          />
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <NotifTab />
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-6">
          <AppTab
            isDarkMode={isDarkMode}
            onThemeChange={onThemeChange}
          />
        </TabsContent>

        {/* Automation */}
        <TabsContent value="automation" className="space-y-6">
          <AutoTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
