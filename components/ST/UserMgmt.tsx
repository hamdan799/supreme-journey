// OriginalName: UserManagement (Settings)
// ShortName: UserMgmt

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Crown,
  User as UserIcon,
  Key,
  Shield
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import type { User, UserRole } from '../../types/user'

const STORAGE_KEYS = {
  USERS: 'inventory_users',
  CURRENT_USER: 'inventory_currentUser',
}

const DEFAULT_USERS: User[] = [
  {
    id: '1',
    name: 'Owner',
    email: 'owner@toko.com',
    role: 'owner',
    password: '1234',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Kasir 1',
    email: 'kasir@toko.com',
    role: 'kasir',
    password: '1234',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export function UserMgmt() {
  useDocumentTitle('Manajemen Pengguna')
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'kasir' as UserRole,
    password: '1234',
  })
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Load users from localStorage on mount
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem(STORAGE_KEYS.USERS)
      const savedCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)

      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers).map((u: any) => ({
          ...u,
          createdAt: new Date(u.createdAt),
          updatedAt: new Date(u.updatedAt),
        }))
        setUsers(parsedUsers)
      } else {
        setUsers(DEFAULT_USERS)
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS))
      }

      if (savedCurrentUser) {
        const parsedCurrentUser = JSON.parse(savedCurrentUser)
        setCurrentUser({
          ...parsedCurrentUser,
          createdAt: new Date(parsedCurrentUser.createdAt),
          updatedAt: new Date(parsedCurrentUser.updatedAt),
        })
      } else {
        setCurrentUser(DEFAULT_USERS[0])
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]))
      }
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }, [])

  const saveUsers = (updatedUsers: User[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers))
      setUsers(updatedUsers)
    } catch (error) {
      console.error('Error saving users:', error)
    }
  }

  const saveCurrentUser = (user: User) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
      setCurrentUser(user)
    } catch (error) {
      console.error('Error saving current user:', error)
    }
  }

  const createUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedUsers = [...users, newUser]
    saveUsers(updatedUsers)
    toast.success(`Pengguna ${newUser.name} berhasil ditambahkan`)
    return newUser
  }

  const updateUser = (userId: string, updates: Partial<User>) => {
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, ...updates, updatedAt: new Date() } : u
    )
    saveUsers(updatedUsers)

    if (currentUser?.id === userId) {
      const updatedCurrentUser = updatedUsers.find((u) => u.id === userId)
      if (updatedCurrentUser) {
        saveCurrentUser(updatedCurrentUser)
      }
    }

    toast.success('Pengguna berhasil diperbarui')
  }

  const deleteUser = (userId: string) => {
    if (currentUser?.id === userId) {
      toast.error('Tidak bisa menghapus pengguna yang sedang aktif')
      return
    }

    const ownersCount = users.filter((u) => u.role === 'owner').length
    const userToDelete = users.find((u) => u.id === userId)
    if (userToDelete?.role === 'owner' && ownersCount <= 1) {
      toast.error('Tidak bisa menghapus owner terakhir')
      return
    }

    const updatedUsers = users.filter((u) => u.id !== userId)
    saveUsers(updatedUsers)
    toast.success('Pengguna berhasil dihapus')
  }

  const changePassword = (userId: string, oldPassword: string, newPassword: string): boolean => {
    const user = users.find((u) => u.id === userId)

    if (!user) {
      toast.error('Pengguna tidak ditemukan')
      return false
    }

    if (user.password !== oldPassword) {
      toast.error('Password lama salah')
      return false
    }

    updateUser(userId, { password: newPassword })
    toast.success('Password berhasil diubah')
    return true
  }

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      role: 'kasir',
      password: '1234',
    })
    setShowAddDialog(true)
  }

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email || '',
      role: user.role,
      password: user.password,
    })
    setShowEditDialog(true)
  }

  const handleOpenDelete = (user: User) => {
    setSelectedUser(user)
    setShowDeleteDialog(true)
  }

  const handleOpenPassword = (user: User) => {
    setSelectedUser(user)
    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setShowPasswordDialog(true)
  }

  const handleCreateUser = () => {
    if (!formData.name.trim()) {
      toast.error('Nama wajib diisi')
      return
    }

    createUser({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      password: formData.password,
    })

    setShowAddDialog(false)
  }

  const handleUpdateUser = () => {
    if (!selectedUser) return

    if (!formData.name.trim()) {
      toast.error('Nama wajib diisi')
      return
    }

    updateUser(selectedUser.id, {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      password: formData.password,
    })

    setShowEditDialog(false)
  }

  const handleDeleteUser = () => {
    if (!selectedUser) return
    deleteUser(selectedUser.id)
    setShowDeleteDialog(false)
  }

  const handleChangePassword = () => {
    if (!selectedUser) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Password baru tidak cocok')
      return
    }

    if (passwordData.newPassword.length < 4) {
      toast.error('Password minimal 4 karakter')
      return
    }

    const success = changePassword(
      selectedUser.id,
      passwordData.oldPassword,
      passwordData.newPassword
    )

    if (success) {
      setShowPasswordDialog(false)
    }
  }

  // Only owner can manage users
  if (currentUser?.role !== 'owner') {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Shield className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Akses Terbatas</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Hanya Owner yang dapat mengelola pengguna
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Kelola Pengguna
              </CardTitle>
              <CardDescription>
                Tambah, edit, atau hapus pengguna sistem
              </CardDescription>
            </div>
            <Button onClick={handleOpenAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Pengguna
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-4 border rounded-lg ${
                  currentUser?.id === user.id ? 'bg-accent/30' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{user.name}</span>
                      {currentUser?.id === user.id && (
                        <Badge variant="secondary" className="text-xs">
                          Aktif Sekarang
                        </Badge>
                      )}
                    </div>
                    {user.email && (
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={user.role === 'owner' ? 'default' : 'outline'} className="text-xs capitalize">
                        {user.role === 'owner' ? (
                          <><Crown className="w-3 h-3 mr-1" /> Owner</>
                        ) : (
                          <><UserIcon className="w-3 h-3 mr-1" /> Kasir</>
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenPassword(user)}
                  >
                    <Key className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(user)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDelete(user)}
                    disabled={currentUser?.id === user.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Pengguna Baru</DialogTitle>
            <DialogDescription>
              Buat akun pengguna baru untuk sistem
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama *</Label>
              <Input
                placeholder="Nama pengguna"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner (Full Access)</SelectItem>
                  <SelectItem value="kasir">Kasir (Limited Access)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Password *</Label>
              <Input
                type="password"
                placeholder="Minimal 4 karakter"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleCreateUser}>
              Tambah Pengguna
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
            <DialogDescription>
              Ubah informasi pengguna
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama *</Label>
              <Input
                placeholder="Nama pengguna"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner (Full Access)</SelectItem>
                  <SelectItem value="kasir">Kasir (Limited Access)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleUpdateUser}>
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengguna?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pengguna <strong>{selectedUser?.name}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser}>
              Hapus Pengguna
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Password</DialogTitle>
            <DialogDescription>
              Ubah password untuk {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Password Lama *</Label>
              <Input
                type="password"
                placeholder="Password lama"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Password Baru *</Label>
              <Input
                type="password"
                placeholder="Minimal 4 karakter"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Konfirmasi Password Baru *</Label>
              <Input
                type="password"
                placeholder="Ketik ulang password baru"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleChangePassword}>
              Ubah Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
