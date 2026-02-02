// OriginalName: EnhancedSidebar  
// ShortName: EnhSide

import { 
  BarChart3, 
  Package, 
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CreditCard,
  UserCheck,
  DollarSign,
  Menu,
  X,
  Users,
  Settings,
  FileText,
  Wrench,
  ShoppingCart,
  History,
  TrendingUp,
  LayoutGrid,
  Tag,
  Box,
  Boxes,
  Smartphone,
  Cpu,
  FileBarChart,
  User,
  Building2,
  UserCircle,
  Warehouse,
  Calendar,
  CircleDollarSign,
  PieChart,
  Activity,
  Brain,
  Lightbulb,
  LineChart,
  UserCog,
  Database,
  Bell,
  Palette,
  Zap,
  Briefcase,
  Store
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { canAccessMenu } from '../types/user'
import type { UserRole } from '../types/user'

interface EnhancedSidebarProps {
  activeMenu: string
  setActiveMenu: (menu: string) => void
  storeName?: string
  storeLogo?: string
  onGlobalSearch?: (query: string) => void
  userRole?: UserRole
}

interface MenuItem {
  id: string
  label: string
  icon: any
  badge?: number | null
  children?: MenuItem[]
}

export function EnhancedSidebar({ 
  activeMenu, 
  setActiveMenu, 
  storeName, 
  storeLogo, 
  onGlobalSearch,
  userRole = 'owner'
}: EnhancedSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [currentStoreName, setCurrentStoreName] = useState('Sistem Kelola Barang')
  const [currentStoreLogo, setCurrentStoreLogo] = useState('')
  const [notificationCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['barang-stok', 'master', 'analitik', 'pengaturan-group']))

  useEffect(() => {
    // Mobile detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Load store settings from localStorage
    try {
      const savedStoreSettings = localStorage.getItem('inventory_storeSettings')
      if (savedStoreSettings) {
        const settings = JSON.parse(savedStoreSettings)
        if (settings.storeName) setCurrentStoreName(settings.storeName)
        if (settings.storeLogo) setCurrentStoreLogo(settings.storeLogo)
      }
    } catch (error) {
      console.error('Failed to load store settings:', error)
    }

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (storeName) {
      setCurrentStoreName(storeName)
    }
  }, [storeName])

  useEffect(() => {
    if (storeLogo !== undefined) {
      setCurrentStoreLogo(storeLogo)
    }
  }, [storeLogo])

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  const allMenuItems: MenuItem[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3,
      badge: null
    },
    { 
      id: 'barang-stok', 
      label: 'Barang & Stok', 
      icon: Package,
      badge: null,
      children: [
        { id: 'barang', label: 'Produk (Sparepart)', icon: Box },
        { id: 'kategori', label: 'Kategori', icon: LayoutGrid },
        { id: 'brand-sparepart', label: 'Brand Sparepart', icon: Cpu },
        { id: 'kelola-stok', label: 'Kelola Stok', icon: Boxes },
        { id: 'laporan', label: 'Laporan Stok', icon: FileBarChart }
      ]
    },
    { 
      id: 'master', 
      label: 'Master', 
      icon: Database,
      badge: null,
      children: [
        { id: 'brand-hp', label: 'Brand', icon: Smartphone },
        { id: 'master-kerusakan', label: 'Damage', icon: Wrench }
      ]
    },
    { 
      id: 'transaksi-group', 
      label: 'Transaksi', 
      icon: CreditCard,
      badge: notificationCount > 0 ? notificationCount : null,
      children: [
        { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
        { id: 'transaksi', label: 'Riwayat Transaksi', icon: History }
      ]
    },
    { 
      id: 'hutang-piutang', 
      label: 'Hutang Piutang', 
      icon: UserCheck,
      badge: null
    },
    { 
      id: 'kontak', 
      label: 'Kontak', 
      icon: Users,
      badge: null
    },
    { 
      id: 'nota-group', 
      label: 'Nota / Service', 
      icon: ClipboardList,
      badge: null,
      children: [
        { id: 'nota', label: 'Service', icon: Wrench },
        { id: 'nota-pesanan', label: 'Pesanan', icon: ClipboardList }
      ]
    },
    { 
      id: 'keuangan-group', 
      label: 'Keuangan', 
      icon: DollarSign,
      badge: null,
      children: [
        { id: 'keuangan', label: 'Ringkasan Keuangan', icon: CircleDollarSign }
      ]
    },
    { 
      id: 'analitik', 
      label: 'Analitik', 
      icon: TrendingUp,
      badge: null,
      children: [
        { id: 'analitik-keuangan', label: 'Keuangan', icon: DollarSign },
        { id: 'analitik-penjualan', label: 'Penjualan & Pelanggan', icon: ShoppingCart },
        { id: 'analitik-inventory', label: 'Stok & Sparepart', icon: Package },
        { id: 'analitik-repair-ai', label: 'Repair & AI', icon: Wrench }
      ]
    },
    { 
      id: 'dokumen-group', 
      label: 'Dokumen', 
      icon: FileText,
      badge: null,
      children: [
        { id: 'dokumen-builder', label: 'Report Builder', icon: FileBarChart },
        { id: 'dokumen-export', label: 'Export Center', icon: FileText },
        { id: 'dokumen-advanced', label: 'Advanced Reports', icon: PieChart }
      ]
    },
    { 
      id: 'pengaturan-group', 
      label: 'Setting', 
      icon: Settings,
      badge: null,
      children: [
        { id: 'pengaturan-bisnis', label: 'Profil Bisnis', icon: Store },
        { id: 'pengaturan-pengguna', label: 'Pengguna', icon: Users },
        { id: 'pengaturan-tampilan', label: 'Tampilan', icon: Palette },
        { id: 'pengaturan-notifikasi', label: 'Notifikasi', icon: Bell },
        { id: 'pengaturan-otomasi', label: 'Otomasi', icon: Zap },
        { id: 'pengaturan-backup', label: 'Backup & Data', icon: Database }
      ]
    }
  ]

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => {
    // Check parent access
    const hasParentAccess = canAccessMenu(userRole, item.id)
    if (!hasParentAccess) return false

    // Filter children if they exist
    if (item.children) {
      const filteredChildren = item.children.filter(child => 
        canAccessMenu(userRole, child.id)
      )
      // Only show parent if it has accessible children or if parent itself is a page
      if (filteredChildren.length === 0) {
        return false
      }
      // Update children with filtered list
      item.children = filteredChildren
    }

    return true
  })

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    const Icon = item.icon
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedGroups.has(item.id)
    const isActive = activeMenu === item.id

    const paddingLeft = isCollapsed
      ? 'px-2'
      : isChild
        ? 'pl-8 pr-3'   // CHILD INDENT (INI FIX)
        : 'pl-3 pr-3'
    
    return (
      <div key={item.id} className="w-full">
        
        {/* BUTTON LEVEL 1 & LEVEL 2 */}
        <Button
          onClick={() => {
            if (hasChildren) {
              // FIX: Kalau collapsed → auto un-collapse
              if (isCollapsed) setIsCollapsed(false)

              toggleGroup(item.id)
            } else {
              setActiveMenu(item.id)
              if (isMobile) setIsMobileOpen(false)
            }
          }}
          variant={isActive ? "default" : "ghost"}
          size="sm"
          className={`
            w-full text-left flex items-center
            ${paddingLeft} 
            ${isActive 
              ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' 
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            }
            transition-all duration-200
          `}
          title={isCollapsed ? item.label : undefined}
        >
          <Icon className="w-4 h-4 flex-shrink-0" />

          {!isCollapsed && (
            <>
              <span className="ml-2 flex-1">{item.label}</span>

              {item.badge && (
                <Badge variant="secondary" className="text-xs ml-2">
                  {item.badge}
                </Badge>
              )}

              {hasChildren && (
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`} 
                />
              )}
            </>
          )}
        </Button>

        {/* CHILDREN LIST */}
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1 ml-4 border-l border-sidebar-border/50 pl-2">
            {item.children!.map(child => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && !isMobileOpen && (
        <Button
          onClick={() => setIsMobileOpen(true)}
          variant="ghost"
          size="sm"
          className="fixed top-4 left-4 z-40 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <div className={`
        ${isMobile 
          ? `sidebar-mobile ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} w-56` 
          : `${isCollapsed ? 'w-16' : 'w-52'}`
        }
        bg-sidebar border-r border-sidebar-border 
        transition-all duration-300 ease-in-out 
        flex flex-col h-full relative
        custom-scrollbar
        ${isMobile ? 'z-50' : ''}
      `}>
        {/* Mobile Close Button */}
        {isMobile && (
          <Button
            onClick={() => setIsMobileOpen(false)}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 md:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {currentStoreLogo ? (
                <img 
                  src={currentStoreLogo} 
                  alt="Logo" 
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-sidebar-primary-foreground" />
                </div>
              )}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-medium text-sidebar-foreground truncate">
                  {currentStoreName}
                </h2>
                <p className="text-xs text-sidebar-foreground/60">
                  Sistem Manajemen
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>

        {/* Bottom Controls */}
        <div className="p-4 border-t border-sidebar-border space-y-3">
          {/* Storage Status */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'}`}>
            <Package className={`w-4 h-4 text-primary ${isCollapsed ? '' : 'flex-shrink-0'}`} />
            {!isCollapsed && (
              <span className="text-xs text-sidebar-foreground">
                Mode Lokal
              </span>
            )}
          </div>

          {/* Collapse Toggle - Hidden on mobile */}
          {!isMobile && (
            <Button
              onClick={() => setIsCollapsed(!isCollapsed)}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span className="ml-2">Sembunyikan</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  )
}