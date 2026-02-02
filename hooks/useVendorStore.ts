// OriginalName: useVendorStore
// ShortName: useVendorStore

import { useState, useEffect } from 'react'
import type { Vendor } from '../types/inventory'
import { toast } from 'sonner'

const STORAGE_KEY = 'inventory_vendors'

export function useVendorStore() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load vendors from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        const vendorsWithDates = parsed.map((v: any) => ({
          ...v,
          createdAt: new Date(v.createdAt),
          updatedAt: new Date(v.updatedAt)
        }))
        setVendors(vendorsWithDates)
      }
    } catch (error) {
      console.error('Error loading vendors:', error)
      toast.error('Gagal memuat data vendor')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save to localStorage whenever vendors change
  const saveToStorage = (updatedVendors: Vendor[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVendors))
      setVendors(updatedVendors)
    } catch (error) {
      console.error('Error saving vendors:', error)
      toast.error('Gagal menyimpan data vendor')
    }
  }

  // Create vendor
  const createVendor = (vendorData: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: `vendor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const updated = [...vendors, newVendor]
    saveToStorage(updated)
    toast.success(`Vendor "${vendorData.nama_vendor}" berhasil ditambahkan`)
    return newVendor
  }

  // Update vendor
  const updateVendor = (id: string, updates: Partial<Vendor>) => {
    const updated = vendors.map(v =>
      v.id === id
        ? { ...v, ...updates, updatedAt: new Date() }
        : v
    )
    saveToStorage(updated)
    toast.success('Vendor berhasil diupdate')
  }

  // Delete vendor
  const deleteVendor = (id: string) => {
    const vendor = vendors.find(v => v.id === id)
    const updated = vendors.filter(v => v.id !== id)
    saveToStorage(updated)
    toast.success(`Vendor "${vendor?.nama_vendor}" berhasil dihapus`)
  }

  // Get vendor by ID
  const getVendorById = (id: string) => {
    return vendors.find(v => v.id === id)
  }

  // Search vendors
  const searchVendors = (query: string) => {
    if (!query.trim()) return vendors

    const lowerQuery = query.toLowerCase()
    return vendors.filter(v =>
      v.nama_vendor.toLowerCase().includes(lowerQuery) ||
      v.kontak?.toLowerCase().includes(lowerQuery) ||
      v.email?.toLowerCase().includes(lowerQuery) ||
      v.catatan?.toLowerCase().includes(lowerQuery)
    )
  }

  return {
    vendors,
    isLoading,
    createVendor,
    updateVendor,
    deleteVendor,
    getVendorById,
    searchVendors
  }
}
