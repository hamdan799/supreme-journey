import React, { lazy, Suspense, useState, useRef, useEffect, Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { useLocalStorage } from './hooks/useLS'
import { useAuth } from './hooks/useAuth'
import { useUserManagement } from './hooks/useUserManagement'
import { useTheme } from './hooks/useTheme'
import { useBrandSparepart } from './hooks/useBrandSparepart'
import { useNotaStore } from './hooks/useNotaStore'
import { Loader2, Package } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { Button } from './components/ui/button'
import { Auth } from './components/Auth'
import { EnhancedSidebar } from './components/EnhSide'
import { AppHeader } from './components/AppHeader'
import { GlobalSearchResults } from './components/GlobalSR'
import type { StockLog, Receipt, Category, Product, Contact } from './types/inventory'
import type { Transaction } from './types/financial'

// Component lazy loading
const DB = lazy(() => import('./components/DB').then(m => ({ default: m.DB })))
const PM = lazy(() => import('./components/PM').then(m => ({ default: m.PM })))
const Master = lazy(() => import('./components/Master').then(m => ({ default: m.Master })))
const TX = lazy(() => import('./components/TX').then(m => ({ default: m.TX })))
const RP = lazy(() => import('./components/RP').then(m => ({ default: m.RP })))
const FR = lazy(() => import('./components/FR').then(m => ({ default: m.FR })))

// Analytics - 4 separate pages
const FinAnaly = lazy(() => import('./components/AN').then(m => ({ default: m.FinAnaly })))
const SalesAnaly = lazy(() => import('./components/AN').then(m => ({ default: m.SalesAnaly })))
const InvAnaly = lazy(() => import('./components/AN').then(m => ({ default: m.InvAnaly })))
const RepairAnaly = lazy(() => import('./components/AN').then(m => ({ default: m.RepairAnaly })))

const CT = lazy(() => import('./components/CT').then(m => ({ default: m.CT })))
const DT = lazy(() => import('./components/DT').then(m => ({ default: m.DT })))
const ST = lazy(() => import('./components/ST').then(m => ({ default: m.ST })))
const NSPage = lazy(() => import('./components/Nota').then(m => ({ default: m.NSPage })))
const NPPage = lazy(() => import('./components/Nota').then(m => ({ default: m.NPPage })))
const Reports = lazy(() => import('./components/Reports').then(m => ({ default: m.Reports })))

// New Barang & Stok pages (Blueprint Maksimal)
const ProdukPage = lazy(() => import('./components/PM/Prod/Prod').then(m => ({ default: m.default })))
const KategoriPage = lazy(() => import('./components/PM/Cat/Cat').then(m => ({ default: m.default })))
const BrandSparepartPage = lazy(() => import('./components/PM/BSP/BSP').then(m => ({ default: m.default })))
const KelolaStokPage = lazy(() => import('./components/PM/Stock/Stock').then(m => ({ default: m.default })))
const LaporanStokPage = lazy(() => import('./components/PM/Rpt/Rpt').then(m => ({ default: m.default })))

// New Master HP pages (Blueprint Maksimal)
const BrandHPPage = lazy(() => import('./components/Master/BHP/BHP').then(m => ({ default: m.default })))
// Master Data - Jenis Kerusakan
const DamageTypePage = lazy(() => import('./components/Master/DT/DTPage').then(m => ({ default: m.DTPage })))
// DeviceModelPage removed - MODE B: background data only, no UI page

// POS Standalone Page
const POS = lazy(() => import('./components/TX/pos').then(m => ({ default: m.POS })))

// Settings Pages (Individual)
const BizPage = lazy(() => import('./components/ST/pages/BizPage'))
const UMPage = lazy(() => import('./components/ST/pages/UMPage'))
const BackPage = lazy(() => import('./components/ST/pages/BackPage'))
const NotifPage = lazy(() => import('./components/ST/pages/NotifPage'))
const AppPage = lazy(() => import('./components/ST/pages/AppPage'))
const AutoPage = lazy(() => import('./components/ST/pages/AutoPage'))

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">Memuat halaman...</p>
      </div>
    </div>
  )
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const ButtonComponent = Button
      return (
        <div className="flex items-center justify-center h-screen bg-background p-4">
          <div className="text-center space-y-4 max-w-md">
            <Package className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="text-xl font-medium">Terjadi Kesalahan</h1>
            <p className="text-sm text-muted-foreground">
              {this.state.error?.message || 'Aplikasi mengalami error'}
            </p>
            <ButtonComponent onClick={() => window.location.reload()}>
              Muat Ulang Halaman
            </ButtonComponent>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function AppContent() {
  const { user, isLoading: authLoading, isAuthenticated, login, register, loginWithGoogle, guestMode } = useAuth()
  const { currentUser } = useUserManagement()
  const { isDarkMode, setIsDarkMode } = useTheme()
  
  // BLUEPRINT: Brand Sparepart Hook
  const {
    brands: sparepartBrands,
    createBrand: createSparepartBrand,
    updateBrand: updateSparepartBrand,
    deleteBrand: deleteSparepartBrand,
  } = useBrandSparepart()
  
  // Nota Store Hook
  const { getNotaById, updateNota, finalizeNota } = useNotaStore()
  
  const getInitialMenu = () => {
    const hash = window.location.hash.slice(1) // Remove #
    
    const validMenus = ['dashboard', 'barang', 'kategori', 'brand-sparepart', 'kelola-stok', 'laporan', 'brand-hp', 'master-kerusakan', 'transaksi', 'pos', 'hutang-piutang', 'kontak', 'nota', 'nota-pesanan', 'keuangan', 'analitik-keuangan', 'analitik-penjualan', 'analitik-inventory', 'analitik-repair-ai', 'dokumen', 'dokumen-builder', 'dokumen-export', 'dokumen-advanced', 'pengaturan', 'pengaturan-bisnis', 'pengaturan-pengguna', 'pengaturan-backup', 'pengaturan-notifikasi', 'pengaturan-tampilan', 'pengaturan-otomasi']
    return validMenus.includes(hash) ? hash : 'dashboard'
  }
  
  const [activeMenu, setActiveMenu] = useState(getInitialMenu())
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [analysisFilter, setAnalysisFilter] = useState<'sale' | 'expense' | 'all'>('all')
  const [searchResults, setSearchResults] = useState<{
    products: Product[]
    transactions: Transaction[]
    categories: Category[]
  }>({
    products: [],
    transactions: [],
    categories: []
  })
  
  // Ref for debouncing toast
  const toastShownRef = useRef(false)
  
  // Use local storage hook for data management
  const {
    products,
    categories,
    transactions,
    stockLogs,
    receipts,
    contacts,
    storeInfo,
    damageTypes,
    isLoading,
    isConnected,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    updateCategory,
    deleteCategory,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    createStockLog,
    updateStockLog,
    deleteStockLog,
    createReceipt,
    deleteReceipt,
    createContact,
    updateContact,
    deleteContact,
    updateStoreInfo,
    createDamageType,
    updateDamageType,
    deleteDamageType
  } = useLocalStorage()

  // Show connection status with debounce to prevent overlap
  useEffect(() => {
    if (!isLoading && !toastShownRef.current) {
      toastShownRef.current = true
      // Clear any existing toasts first
      toast.dismiss()
      
      setTimeout(() => {
        toast.success('Mode Lokal', {
          description: 'Menggunakan localStorage - Data tersimpan di perangkat Anda',
          duration: 3000,
          id: 'connection-status'
        })
      }, 500)
    }
  }, [isLoading])
  
  // Sync activeMenu with URL hash
  useEffect(() => {
    window.location.hash = activeMenu
  }, [activeMenu])
  
  // Listen to hash changes (back/forward button)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      
      const validMenus = ['dashboard', 'barang', 'kategori', 'brand-sparepart', 'kelola-stok', 'laporan', 'brand-hp', 'master-kerusakan', 'transaksi', 'pos', 'hutang-piutang', 'kontak', 'nota', 'nota-pesanan', 'keuangan', 'analitik-keuangan', 'analitik-penjualan', 'analitik-inventory', 'analitik-repair-ai', 'dokumen', 'dokumen-builder', 'dokumen-export', 'dokumen-advanced', 'pengaturan', 'pengaturan-bisnis', 'pengaturan-pengguna', 'pengaturan-backup', 'pengaturan-notifikasi', 'pengaturan-tampilan', 'pengaturan-otomasi']
      if (validMenus.includes(hash)) {
        setActiveMenu(hash)
      }
    }
    
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Listen to navigate event from AppHeader notifications
  useEffect(() => {
    const handleNavigate = (e: any) => {
      const menu = e.detail?.menu
      if (menu) {
        setActiveMenu(menu)
      }
    }
    
    window.addEventListener('navigate', handleNavigate)
    return () => window.removeEventListener('navigate', handleNavigate)
  }, [])

  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light'
    document.documentElement.className = theme
    localStorage.setItem('theme', theme)
  }, [isDarkMode])

  const handleGlobalSearch = (query: string) => {
    if (!query.trim()) return

    setSearchQuery(query)

    // Search in products
    const productResults = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase()) ||
      p.sku?.toLowerCase().includes(query.toLowerCase())
    )

    // Search in transactions
    const transactionResults = transactions.filter(t =>
      t.customerName?.toLowerCase().includes(query.toLowerCase()) ||
      t.catatan?.toLowerCase().includes(query.toLowerCase()) ||
      t.transactionNumber?.toLowerCase().includes(query.toLowerCase())
    )

    // Search in categories
    const categoryResults = categories.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.description?.toLowerCase().includes(query.toLowerCase())
    )

    setSearchResults({
      products: productResults,
      transactions: transactionResults,
      categories: categoryResults
    })

    setShowSearchResults(true)

    // Show toast notification
    const totalResults = productResults.length + transactionResults.length + categoryResults.length
    if (totalResults > 0) {
      toast.success(`Ditemukan ${totalResults} hasil untuk "${query}"`)
    } else {
      toast.info(`Tidak ada hasil untuk "${query}"`)
    }
  }

  const handleSearchResultSelect = (type: string, item: any) => {
    setShowSearchResults(false)
    
    if (type === 'product') {
      setActiveMenu('barang')
      toast.success(`Navigasi ke produk: ${item.name}`)
    } else if (type === 'transaction') {
      setActiveMenu('transaksi')
      toast.success(`Navigasi ke transaksi: ${item.transactionNumber || 'TRX-' + item.id?.slice(0, 8)}`)
    } else if (type === 'category') {
      setActiveMenu('barang')
      toast.success(`Navigasi ke kategori: ${item.name}`)
    }
  }

  // Loading screen
  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Package className="w-12 h-12 text-primary mr-3" />
            <div className="text-left">
              <h1 className="text-xl font-medium">Sistem Kelola Barang</h1>
              <p className="text-sm text-muted-foreground">Memuat aplikasi...</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Memuat data...</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-primary">Mode Lokal</span>
          </div>
        </div>
      </div>
    )
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Auth
          onLogin={login}
          onRegister={register}
          onGoogleAuth={loginWithGoogle}
          onGuestMode={guestMode}
        />
        <Toaster 
          position="top-right"
          expand={false}
          richColors={true}
          closeButton={true}
        />
      </>
    )
  }

  // Pages mapping - cleaner than switch statement
  const pages: Record<string, JSX.Element> = {
    'dashboard': (
      <DB
        stockLogs={stockLogs}
        receipts={receipts}
        transactions={transactions}
        categories={categories}
        products={products}
        contacts={contacts}
        onStockLogCreate={createStockLog}
        onReceiptCreate={createReceipt}
        onTransactionCreate={createTransaction}
        onProductUpdate={updateProduct}
        onContactCreate={createContact}
        onCategoryCreate={createCategory}
        onProductCreate={createProduct}
        onNavigateToAnalysis={(filter) => {
          setAnalysisFilter(filter)
          setActiveMenu('analitik-keuangan')
        }}
        onNavigateToProduct={() => {
          setActiveMenu('barang')
        }}
        storeInfo={storeInfo}
      />
    ),
    // Barang & Stok Group - Using separate pages
    'barang': (
      <ProdukPage
        products={products}
        categories={categories}
        contacts={contacts}
        onProductCreate={createProduct}
        onProductUpdate={updateProduct}
        onProductDelete={deleteProduct}
      />
    ),
    'kategori': (
      <KategoriPage
        products={products}
        categories={categories}
        onCategoryCreate={createCategory}
        onCategoryUpdate={updateCategory}
        onCategoryDelete={deleteCategory}
      />
    ),
    'brand-sparepart': (
      <BrandSparepartPage
        products={products}
        brands={sparepartBrands}
        onBrandCreate={createSparepartBrand}
        onBrandUpdate={updateSparepartBrand}
        onBrandDelete={deleteSparepartBrand}
      />
    ),
    'kelola-stok': (
      <KelolaStokPage
        products={products}
        stockLogs={stockLogs}
        contacts={contacts}
        onProductUpdate={updateProduct}
        onStockLogCreate={createStockLog}
      />
    ),
    'laporan': (
      <LaporanStokPage
        products={products}
        categories={categories}
        stockLogs={stockLogs}
      />
    ),
    // Master HP Group - Using separate pages
    'brand-hp': (
      <BrandHPPage />
    ),
    // Master Data - Jenis Kerusakan
    'master-kerusakan': (
      <DamageTypePage
        damageTypes={damageTypes}
        onDamageCreate={createDamageType}
        onDamageUpdate={updateDamageType}
        onDamageDelete={deleteDamageType}
      />
    ),
    // DeviceModelPage removed - MODE B: background data only, no UI page
    // Transaksi Group
    'pos': (
      <POS
        products={products}
        contacts={contacts}
        onTransactionCreate={createTransaction}
        onProductUpdate={updateProduct}
        onStockLogCreate={createStockLog}
        storeInfo={storeInfo}
      />
    ),
    'transaksi': (
      <TX
        transactions={transactions}
        products={products}
        receipts={receipts}
        contacts={contacts}
        categories={categories}
        onTransactionCreate={createTransaction}
        onTransactionUpdate={updateTransaction}
        onTransactionDelete={deleteTransaction}
        onReceiptCreate={createReceipt}
        onProductUpdate={updateProduct}
        onStockLogCreate={createStockLog}
        onContactCreate={createContact}
        onCategoryCreate={createCategory}
        onProductCreate={createProduct}
        storeInfo={storeInfo}
      />
    ),
    // Hutang Piutang (standalone)
    'hutang-piutang': (
      <DT
        transactions={transactions}
        contacts={contacts}
        onTransactionCreate={createTransaction}
        onTransactionUpdate={updateTransaction}
        onTransactionDelete={deleteTransaction}
        onContactCreate={createContact}
        storeInfo={storeInfo}
      />
    ),
    // Kontak & Vendor Group
    'kontak': (
      <CT
        contacts={contacts}
        onContactCreate={createContact}
        onContactUpdate={updateContact}
        onContactDelete={deleteContact}
      />
    ),
    // Nota / Service Group
    'nota': (
      <NSPage
        products={products}
        categories={categories}
        contacts={contacts}
        onProductUpdate={updateProduct}
        onProductCreate={createProduct}
        onStockLogCreate={createStockLog}
        onTransactionCreate={createTransaction}
        onContactCreate={createContact}
      />
    ),
    'nota-pesanan': (
      <NPPage
        products={products}
        categories={categories}
        contacts={contacts}
        onProductUpdate={updateProduct}
        onProductCreate={createProduct}
        onStockLogCreate={createStockLog}
        onTransactionCreate={createTransaction}
        onContactCreate={createContact}
      />
    ),
    // Keuangan Group
    'keuangan': (
      <FR
        transactions={transactions}
        products={products}
        stockLogs={stockLogs}
        receipts={receipts}
      />
    ),
    // Analitik Group - 4 separate pages
    'analitik-keuangan': (
      <FinAnaly />
    ),
    'analitik-penjualan': (
      <SalesAnaly />
    ),
    'analitik-inventory': (
      <InvAnaly />
    ),
    'analitik-repair-ai': (
      <RepairAnaly />
    ),
    // Dokumen Group
    'dokumen': (
      <Reports
        products={products}
        transactions={transactions}
      />
    ),
    'dokumen-builder': (
      <Reports
        products={products}
        transactions={transactions}
      />
    ),
    'dokumen-export': (
      <Reports
        products={products}
        transactions={transactions}
      />
    ),
    'dokumen-advanced': (
      <Reports
        products={products}
        transactions={transactions}
      />
    ),
    // Pengaturan Group
    'pengaturan': (
      <ST
        storeInfo={storeInfo}
        onStoreInfoUpdate={updateStoreInfo}
        isDarkMode={isDarkMode}
        onThemeChange={setIsDarkMode}
        products={products}
        categories={categories}
        transactions={transactions}
        stockLogs={stockLogs}
        receipts={receipts}
        contacts={contacts}
        onDataImport={(data) => {
          console.log('Data import:', data)
          toast.success('Import data berhasil! Silakan refresh halaman untuk melihat perubahan.')
        }}
        onDataReset={() => {
          toast.loading('Mereset data...', { id: 'reset-data' })
          setTimeout(() => {
            localStorage.clear()
            toast.success('Data berhasil direset!', { id: 'reset-data' })
            setTimeout(() => window.location.reload(), 500)
          }, 1000)
        }}
      />
    ),
    // Settings Individual Pages
    'pengaturan-bisnis': (
      <BizPage
        storeInfo={storeInfo}
        onStoreInfoUpdate={updateStoreInfo}
      />
    ),
    'pengaturan-pengguna': (
      <UMPage />
    ),
    'pengaturan-backup': (
      <BackPage
        products={products}
        categories={categories}
        transactions={transactions}
        stockLogs={stockLogs}
        receipts={receipts}
        contacts={contacts}
        storeInfo={storeInfo}
        onDataImport={(data) => {
          console.log('Data import:', data)
          toast.success('Import data berhasil! Silakan refresh halaman untuk melihat perubahan.')
        }}
        onDataReset={() => {
          toast.loading('Mereset data...', { id: 'reset-data' })
          setTimeout(() => {
            localStorage.clear()
            toast.success('Data berhasil direset!', { id: 'reset-data' })
            setTimeout(() => window.location.reload(), 500)
          }, 1000)
        }}
      />
    ),
    'pengaturan-notifikasi': (
      <NotifPage />
    ),
    'pengaturan-tampilan': (
      <AppPage
        isDarkMode={isDarkMode}
        onThemeChange={setIsDarkMode}
      />
    ),
    'pengaturan-otomasi': (
      <AutoPage />
    )
  }
  
  const renderContent = () => {
    const page = pages[activeMenu]
    
    if (!page) {
      return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <div className="text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1>Menu tidak ditemukan</h1>
            <p className="text-sm text-muted-foreground mt-2">Halaman "{activeMenu}" tidak tersedia</p>
            <Button onClick={() => setActiveMenu('dashboard')} className="mt-4">
              Kembali ke Dashboard
            </Button>
          </div>
        </div>
      )
    }
    
    return (
      <Suspense fallback={<PageLoader />}>
        {page}
      </Suspense>
    )
  }

  return (
    <div className="flex h-screen bg-background ios-viewport android-keyboard-adjust">
      <EnhancedSidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu}
        storeName={storeInfo.storeName}
        storeLogo={storeInfo.storeLogo}
        userRole={currentUser?.role}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader
          storeName={storeInfo.storeName}
          storeLogo={storeInfo.storeLogo}
          onSearch={handleGlobalSearch}
          onSettingsClick={() => setActiveMenu('pengaturan-bisnis')}
          onUserChanged={() => window.location.reload()}
        />
        <div className="flex-1 overflow-auto">
        <div className="md:hidden mobile-header">
          <div className="flex items-center gap-3">
            {storeInfo.storeLogo ? (
              <img src={storeInfo.storeLogo} alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <Package className="w-8 h-8 text-primary" />
            )}
            <div>
              <h1 className="font-medium">{storeInfo.storeName || 'Sistem Kelola Barang'}</h1>
              <p className="text-xs text-muted-foreground">
                {/* Dashboard */}
                {activeMenu === 'dashboard' && 'Dashboard'}
                {/* Barang & Stok */}
                {activeMenu === 'barang' && 'Produk'}
                {activeMenu === 'kategori' && 'Kategori'}
                {activeMenu === 'kelola-stok' && 'Kelola Stok'}
                {activeMenu === 'brand-hp' && 'Brand HP'}
                {activeMenu === 'brand-sparepart' && 'Brand Sparepart'}
                {activeMenu === 'master-kerusakan' && 'Jenis Kerusakan'}
                {activeMenu === 'laporan' && 'Laporan Stok'}
                {/* Transaksi */}
                {activeMenu === 'pos' && 'Point of Sale'}
                {activeMenu === 'transaksi' && 'Riwayat Transaksi'}
                {/* Hutang Piutang */}
                {activeMenu === 'hutang-piutang' && 'Hutang Piutang'}
                {/* Kontak */}
                {activeMenu === 'kontak' && 'Kontak'}
                {/* Nota */}
                {activeMenu === 'nota' && 'Service'}
                {activeMenu === 'nota-pesanan' && 'Pesanan'}
                {/* Keuangan */}
                {activeMenu === 'keuangan' && 'Ringkasan Keuangan'}
                {/* Analitik */}
                {activeMenu === 'analisis' && 'Analitik'}
                {activeMenu === 'analitik-keuangan' && 'Analitik Keuangan'}
                {activeMenu === 'analitik-penjualan' && 'Penjualan & Pelanggan'}
                {activeMenu === 'analitik-inventory' && 'Stok & Sparepart'}
                {activeMenu === 'analitik-repair-ai' && 'Repair & AI'}
                {/* Dokumen */}
                {activeMenu === 'dokumen' && 'Dokumen'}
                {activeMenu === 'dokumen-builder' && 'Report Builder'}
                {activeMenu === 'dokumen-export' && 'Export Center'}
                {activeMenu === 'dokumen-advanced' && 'Advanced Reports'}
                {/* Pengaturan */}
                {activeMenu === 'pengaturan' && 'Pengaturan'}
                {activeMenu === 'pengaturan-bisnis' && 'Pengaturan Bisnis'}
                {activeMenu === 'pengaturan-pengguna' && 'Manajemen Pengguna'}
                {activeMenu === 'pengaturan-backup' && 'Backup & Restore'}
                {activeMenu === 'pengaturan-notifikasi' && 'Notifikasi'}
                {activeMenu === 'pengaturan-tampilan' && 'Tampilan'}
                {activeMenu === 'pengaturan-otomasi' && 'Otomasi'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
          </div>
        </div>
          <div className="mobile-content">
            {renderContent()}
          </div>
        </div>
      </div>
      
      {/* Global Search Results Dialog */}
      <GlobalSearchResults
        isOpen={showSearchResults}
        onClose={() => setShowSearchResults(false)}
        query={searchQuery}
        results={searchResults}
        onProductSelect={(product) => handleSearchResultSelect('product', product)}
        onTransactionSelect={(transaction) => handleSearchResultSelect('transaction', transaction)}
        onCategorySelect={(category) => handleSearchResultSelect('category', category)}
      />
      
      <Toaster 
        position="top-right"
        expand={false}
        richColors={true}
        closeButton={true}
        toastOptions={{
          style: {
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '1px solid var(--border)',
          },
          duration: 4000,
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  )
}