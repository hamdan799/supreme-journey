// OriginalName: useUserManagement
// ShortName: useUserMgmt

import { useState, useEffect } from 'react'
import { toast } from 'sonner@2.0.3'
import type { User, UserRole } from '../types/user'

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
    password: '1234', // Default password
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Kasir 1',
    email: 'kasir@toko.com',
    role: 'kasir',
    password: '1234', // Default password
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load users from localStorage
  useEffect(() => {
    const loadUsers = () => {
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
          // Initialize with default users
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
          // Set default user as owner
          setCurrentUser(DEFAULT_USERS[0])
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]))
        }
      } catch (error) {
        console.error('Error loading users:', error)
        toast.error('Gagal memuat data pengguna')
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Save users to localStorage
  const saveUsers = (updatedUsers: User[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers))
      setUsers(updatedUsers)
    } catch (error) {
      console.error('Error saving users:', error)
      toast.error('Gagal menyimpan data pengguna')
    }
  }

  // Save current user to localStorage
  const saveCurrentUser = (user: User) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
      setCurrentUser(user)
    } catch (error) {
      console.error('Error saving current user:', error)
      toast.error('Gagal menyimpan pengguna aktif')
    }
  }

  // Create new user
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

  // Update user
  const updateUser = (userId: string, updates: Partial<User>) => {
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, ...updates, updatedAt: new Date() } : u
    )
    saveUsers(updatedUsers)

    // If updating current user, update current user state too
    if (currentUser?.id === userId) {
      const updatedCurrentUser = updatedUsers.find((u) => u.id === userId)
      if (updatedCurrentUser) {
        saveCurrentUser(updatedCurrentUser)
      }
    }

    toast.success('Pengguna berhasil diperbarui')
  }

  // Delete user
  const deleteUser = (userId: string) => {
    // Prevent deleting current user
    if (currentUser?.id === userId) {
      toast.error('Tidak bisa menghapus pengguna yang sedang aktif')
      return
    }

    // Prevent deleting last owner
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

  // Switch user
  const switchUser = (userId: string, password: string): boolean => {
    const user = users.find((u) => u.id === userId)

    if (!user) {
      toast.error('Pengguna tidak ditemukan')
      return false
    }

    if (user.password !== password) {
      toast.error('Password salah')
      return false
    }

    saveCurrentUser(user)
    toast.success(`Berhasil switch ke ${user.name} (${user.role})`)
    return true
  }

  // Change password
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

  return {
    users,
    currentUser,
    isLoading,
    createUser,
    updateUser,
    deleteUser,
    switchUser,
    changePassword,
  }
}
