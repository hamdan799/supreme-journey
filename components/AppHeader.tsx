// OriginalName: AppHeader
// ShortName: AppHeader

import { useState, useEffect, useRef } from 'react'
import { 
  Search, 
  History, 
  Bell, 
  Settings, 
  User as UserIcon, 
  ChevronDown,
  LogOut,
  Shield,
  Key,
  Moon,
  Sun,
  Package,
  RotateCcw,
  Trash2,
  Crown,
  Check
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { ScrollArea } from './ui/scroll-area'
import { useTheme } from '../hooks/useTheme'
import { useUserManagement } from '../hooks/useUserManagement'
import { toast } from 'sonner@2.0.3'
import type { User } from '../types/user'

interface AppHeaderProps {
  storeName: string
  storeLogo?: string
  onSearch: (query: string) => void
  onSettingsClick: () => void
  onUserChanged?: () => void
}

interface DeletedItem {
  id: string
  type: 'product' | 'transaction' | 'category' | 'contact'
  name: string
  deletedAt: Date
  deletedBy: string
  data: any
}

interface Notification {
  id: string
  type: 'low_stock' | 'due_debt' | 'info' | 'warning'
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: Date
}

export function AppHeader({
  storeName,
  storeLogo,
  onSearch,
  onSettingsClick,
  onUserChanged
}: AppHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { isDarkMode, setIsDarkMode } = useTheme()
  const { users, currentUser, switchUser } = useUserManagement()

  // Delete History State
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [deleteHistory, setDeleteHistory] = useState<DeletedItem[]>([])

  // Notifications State
  const [showNotificationDialog, setShowNotificationDialog] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Switch User State
  const [showSwitchUserDialog, setShowSwitchUserDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [switchPassword, setSwitchPassword] = useState('')

  // Load delete history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('delete_history')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setDeleteHistory(parsed.map((item: any) => ({
          ...item,
          deletedAt: new Date(item.deletedAt)
        })))
      } catch (e) {
        console.error('Failed to load delete history:', e)
      }
    }
  }, [])

  // Load notifications from localStorage and generate real-time ones
  useEffect(() => {
    const loadNotifications = () => {
      const savedNotifications = localStorage.getItem('notifications')
      let notifs: Notification[] = []
      
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications)
          notifs = parsed.map((n: any) => ({
            ...n,
            createdAt: new Date(n.createdAt)
          }))
        } catch (e) {
          console.error('Failed to load notifications:', e)
        }
      }

      // Generate real-time notifications
      const products = JSON.parse(localStorage.getItem('inventory_products') || '[]')
      const debts = JSON.parse(localStorage.getItem('inventory_debts') || '[]')

      // Low stock notifications
      const lowStockProducts = products.filter((p: any) => 
        p.stock <= (p.minStock || 5) && p.stock > 0
      )
      
      if (lowStockProducts.length > 0) {
        const existingLowStock = notifs.find(n => n.type === 'low_stock')
        if (!existingLowStock) {
          notifs.push({
            id: `low_stock_${Date.now()}`,
            type: 'low_stock',
            title: 'Stok Rendah',
            message: `${lowStockProducts.length} produk stoknya menipis`,
            link: 'barang',
            read: false,
            createdAt: new Date()
          })
        }
      }

      // Due debt notifications
      const today = new Date()
      const dueDebts = debts.filter((d: any) => {
        if (!d.dueDate) return false
        const dueDate = new Date(d.dueDate)
        return dueDate <= today && d.status !== 'lunas'
      })

      if (dueDebts.length > 0) {
        const existingDueDebt = notifs.find(n => n.type === 'due_debt')
        if (!existingDueDebt) {
          notifs.push({
            id: `due_debt_${Date.now()}`,
            type: 'due_debt',
            title: 'Hutang Jatuh Tempo',
            message: `${dueDebts.length} hutang sudah jatuh tempo`,
            link: 'hutang-piutang',
            read: false,
            createdAt: new Date()
          })
        }
      }

      setNotifications(notifs)
    }

    loadNotifications()
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearching(true)
      try {
        await onSearch(searchQuery)
      } catch (error) {
        toast.error('Pencarian gagal')
      } finally {
        setIsSearching(false)
      }
    }
  }

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode)
    toast.success(`Mode ${!isDarkMode ? 'Gelap' : 'Terang'} aktif`)
  }

  // Restore deleted item
  const handleRestore = (item: DeletedItem) => {
    try {
      const storageKey = `inventory_${item.type}s`
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]')
      
      // Add back the item
      existing.push(item.data)
      localStorage.setItem(storageKey, JSON.stringify(existing))
      
      // Remove from delete history
      const newHistory = deleteHistory.filter(h => h.id !== item.id)
      setDeleteHistory(newHistory)
      localStorage.setItem('delete_history', JSON.stringify(newHistory))
      
      toast.success(`${item.name} berhasil dipulihkan`)
      
      // Reload page to reflect changes
      setTimeout(() => window.location.reload(), 500)
    } catch (error) {
      toast.error('Gagal memulihkan item')
    }
  }

  // Permanently delete from history
  const handlePermanentDelete = (itemId: string) => {
    const newHistory = deleteHistory.filter(h => h.id !== itemId)
    setDeleteHistory(newHistory)
    localStorage.setItem('delete_history', JSON.stringify(newHistory))
    toast.success('Item dihapus permanen dari riwayat')
  }

  // Mark notification as read and navigate
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    const newNotifications = notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    )
    setNotifications(newNotifications)
    
    // Navigate if link exists
    if (notification.link) {
      // Close dialog
      setShowNotificationDialog(false)
      
      // Trigger navigation by dispatching custom event
      window.dispatchEvent(new CustomEvent('navigate', { 
        detail: { menu: notification.link } 
      }))
      
      toast.success(`Menuju ${notification.title}`)
    }
  }

  // Clear all notifications
  const handleClearAllNotifications = () => {
    setNotifications([])
    localStorage.removeItem('notifications')
    toast.success('Semua notifikasi dibersihkan')
  }

  // Open switch user dialog
  const handleOpenSwitchUser = () => {
    setShowSwitchUserDialog(true)
    setSelectedUser(null)
    setSwitchPassword('')
  }

  // Select user to switch to
  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
    setSwitchPassword('')
  }

  // Perform user switch
  const handleSwitchUser = () => {
    if (!selectedUser) {
      toast.error('Pilih pengguna terlebih dahulu')
      return
    }

    const success = switchUser(selectedUser.id, switchPassword)
    
    if (success) {
      setShowSwitchUserDialog(false)
      setSelectedUser(null)
      setSwitchPassword('')
      
      // Notify parent to reload
      onUserChanged?.()
      
      // Reload page after short delay
      setTimeout(() => window.location.reload(), 500)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!currentUser) {
    return null
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 gap-4">
          {/* Left Side - Logo & Search */}
          <div className="flex items-center gap-4 flex-1 max-w-3xl">
            {/* Store Logo & Name */}
            <div className="flex items-center gap-2 min-w-fit">
              {storeLogo ? (
                <img 
                  src={storeLogo} 
                  alt={storeName} 
                  className="w-8 h-8 rounded-lg object-cover" 
                />
              ) : (
                <Package className="w-8 h-8 text-primary" />
              )}
              <span className="hidden md:block whitespace-nowrap">
                {storeName}
              </span>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Cari produk, transaksi, kategori... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isSearching}
                className="pl-10 pr-4 w-full"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </form>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-2">
            {/* Delete History */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHistoryDialog(true)}
              title="Riwayat Hapus"
            >
              <History className="w-5 h-5" />
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotificationDialog(true)}
              className="relative"
              title="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  variant="destructive"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>

            <Separator orientation="vertical" className="h-8" />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>
                      {currentUser.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm">{currentUser.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{currentUser.role}</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm">{currentUser.name}</p>
                    {currentUser.email && (
                      <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                    )}
                    <Badge variant="secondary" className="w-fit mt-1 capitalize">
                      {currentUser.role === 'owner' ? (
                        <><Crown className="w-3 h-3 mr-1" /> Owner</>
                      ) : (
                        <><UserIcon className="w-3 h-3 mr-1" /> Kasir</>
                      )}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleOpenSwitchUser}>
                  <Shield className="w-4 h-4 mr-2" />
                  Switch Pengguna
                </DropdownMenuItem>
                {/* Pengaturan dihapus - sudah ada di sidebar sebagai menu utama */}
                <DropdownMenuItem onClick={handleThemeToggle}>
                  {isDarkMode ? (
                    <Sun className="w-4 h-4 mr-2" />
                  ) : (
                    <Moon className="w-4 h-4 mr-2" />
                  )}
                  Mode {isDarkMode ? 'Terang' : 'Gelap'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Delete History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Riwayat Hapus</DialogTitle>
            <DialogDescription>
              Item yang dihapus dalam 30 hari terakhir. Anda bisa memulihkannya.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-96">
            {deleteHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <History className="w-12 h-12 mb-4 opacity-20" />
                <p>Tidak ada riwayat hapus</p>
              </div>
            ) : (
              <div className="space-y-2">
                {deleteHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="capitalize">
                          {item.type}
                        </Badge>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Dihapus oleh {item.deletedBy} pada {new Date(item.deletedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(item)}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Pulihkan
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePermanentDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Notifikasi</DialogTitle>
                <DialogDescription>
                  {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}
                </DialogDescription>
              </div>
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAllNotifications}
                >
                  Bersihkan Semua
                </Button>
              )}
            </div>
          </DialogHeader>
          
          <ScrollArea className="h-96">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Bell className="w-12 h-12 mb-4 opacity-20" />
                <p>Tidak ada notifikasi</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      notif.read ? 'opacity-60' : 'bg-accent/30'
                    } hover:bg-accent/50`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className={`mt-1 ${
                      notif.type === 'low_stock' ? 'text-orange-500' :
                      notif.type === 'due_debt' ? 'text-red-500' :
                      notif.type === 'warning' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`}>
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{notif.title}</span>
                        {!notif.read && (
                          <Badge variant="default" className="h-5 px-2 text-xs">
                            Baru
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {notif.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notif.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Switch User Dialog */}
      <Dialog open={showSwitchUserDialog} onOpenChange={setShowSwitchUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch Pengguna</DialogTitle>
            <DialogDescription>
              Pilih pengguna yang ingin Anda gunakan, lalu masukkan password
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* User List */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Pilih Pengguna</label>
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedUser?.id === user.id
                        ? 'border-primary bg-primary/10'
                        : 'hover:bg-accent/50'
                    } ${
                      currentUser?.id === user.id
                        ? 'bg-accent/30'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.name}</span>
                          {currentUser?.id === user.id && (
                            <Badge variant="secondary" className="text-xs">
                              Aktif
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground capitalize">
                          {user.role === 'owner' ? (
                            <><Crown className="w-3 h-3" /> Owner</>
                          ) : (
                            <><UserIcon className="w-3 h-3" /> Kasir</>
                          )}
                        </div>
                      </div>
                    </div>
                    {selectedUser?.id === user.id && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Password Input - only show when user is selected */}
            {selectedUser && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Password untuk {selectedUser.name}
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Masukkan password"
                    value={switchPassword}
                    onChange={(e) => setSwitchPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSwitchUser()
                      }
                    }}
                    className="pl-10"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Password default: 1234
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSwitchUserDialog(false)
                  setSelectedUser(null)
                  setSwitchPassword('')
                }}
              >
                Batal
              </Button>
              <Button 
                onClick={handleSwitchUser}
                disabled={!selectedUser || !switchPassword}
              >
                Switch Pengguna
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}