// OriginalName: useAuth
// ShortName: useAuth (already short)

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface User {
  email: string
  name: string
  isGuest: boolean
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const checkSession = () => {
      try {
        const savedUser = localStorage.getItem('inventory_user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Failed to load session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Simple auth - just save user info
      const user: User = {
        email,
        name: email.split('@')[0],
        isGuest: false
      }
      
      localStorage.setItem('inventory_user', JSON.stringify(user))
      setUser(user)
      toast.success('Berhasil masuk!')
    } catch (error: any) {
      toast.error(error.message || 'Gagal masuk')
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      // Simple auth - just save user info
      const user: User = {
        email,
        name,
        isGuest: false
      }
      
      localStorage.setItem('inventory_user', JSON.stringify(user))
      setUser(user)
      toast.success('Akun berhasil dibuat!')
    } catch (error: any) {
      toast.error(error.message || 'Gagal mendaftar')
      throw error
    }
  }

  const loginWithGoogle = async () => {
    try {
      toast.info('Google OAuth tidak tersedia dalam mode offline. Silakan gunakan mode tamu.')
      throw new Error('Google OAuth tidak tersedia dalam mode offline')
    } catch (error: any) {
      toast.error(error.message)
      throw error
    }
  }

  const guestMode = () => {
    const user: User = {
      email: 'guest@local',
      name: 'Pengguna Tamu',
      isGuest: true
    }
    
    localStorage.setItem('inventory_user', JSON.stringify(user))
    setUser(user)
    toast.success('Masuk sebagai tamu')
  }

  const logout = () => {
    localStorage.removeItem('inventory_user')
    setUser(null)
    toast.success('Berhasil keluar')
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    loginWithGoogle,
    guestMode,
    logout
  }
}
