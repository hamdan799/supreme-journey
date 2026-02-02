// OriginalName: ST (Settings & Master Data)
// ShortName: ST

import { Settings } from './Settings'
import type { Product, Category, Contact, StockLog, Receipt } from '../../types/inventory'
import type { Transaction } from '../../types/financial'

interface STProps {
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

export function ST(props: STProps) {
  return <Settings {...props} />
}