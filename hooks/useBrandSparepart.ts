// OriginalName: useBrandSparepartManagement
// ShortName: useBrandSP
// BLUEPRINT v2.6.1: Brand Sparepart dengan tier & is_active

import { useState, useEffect } from 'react'
import { toast } from 'sonner@2.0.3'
import type { SparepartBrand } from '../types/inventory'

const STORAGE_KEY = 'brand-sparepart-data'

export function useBrandSparepart() {
  const [brands, setBrands] = useState<SparepartBrand[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // BLUEPRINT: Backward compatibility - migrate old data to new structure
        const normalized = parsed.map((b: any) => {
          // Migrate old 'archived' to new 'is_active'
          const is_active = b.is_active !== undefined ? b.is_active : !b.archived
          
          return {
            id: b.id,
            name: b.name,
            description: b.description || b.notes || null,
            tier: b.tier || 'unknown' as const,
            is_active: is_active,
            created_at: b.created_at || b.createdAt || new Date().toISOString(),
            updated_at: b.updated_at || b.updatedAt || new Date().toISOString(),
          }
        })
        setBrands(normalized)
      } catch (error) {
        console.error('Failed to parse brand sparepart data:', error)
        setBrands([])
      }
    }
    setIsLoading(false)
  }, [])

  // Save to localStorage
  const saveBrands = (newBrands: SparepartBrand[]) => {
    setBrands(newBrands)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBrands))
  }

  // BLUEPRINT: Create brand
  const createBrand = (brand: SparepartBrand) => {
    const newBrand: SparepartBrand = {
      ...brand,
      id: `bsp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    saveBrands([...brands, newBrand])
    toast.success(`Brand "${newBrand.name}" berhasil ditambahkan`)
    return newBrand
  }

  // BLUEPRINT: Update brand
  const updateBrand = (id: string, updates: Partial<SparepartBrand>) => {
    const updated = brands.map((b) =>
      b.id === id
        ? {
            ...b,
            ...updates,
            updated_at: new Date().toISOString(),
          }
        : b
    )
    saveBrands(updated)
    toast.success('Brand berhasil diupdate')
  }

  // BLUEPRINT: Delete brand (hard delete - only if unused)
  const deleteBrand = (id: string) => {
    const brand = brands.find(b => b.id === id)
    if (!brand) return

    // Check if brand is used
    if (isBrandUsedById(id)) {
      toast.error('Brand ini masih digunakan oleh produk')
      return
    }

    const filtered = brands.filter((b) => b.id !== id)
    saveBrands(filtered)
    toast.success(`Brand "${brand.name}" berhasil dihapus`)
  }

  // BLUEPRINT: Check if brand is used in products by ID
  const isBrandUsedById = (brandId: string): boolean => {
    const products = localStorage.getItem('inventory-products')
    if (!products) return false
    
    try {
      const parsed = JSON.parse(products)
      return parsed.some((p: any) => p.brand_sparepart_id === brandId)
    } catch {
      return false
    }
  }

  // BLUEPRINT: Check if brand is used in products by name (legacy)
  const isBrandUsedByName = (brandName: string): boolean => {
    const products = localStorage.getItem('inventory-products')
    if (!products) return false
    
    try {
      const parsed = JSON.parse(products)
      return parsed.some((p: any) => p.brand_sparepart === brandName)
    } catch {
      return false
    }
  }

  // BLUEPRINT: Check if brand is used in notas (sub-pesanan)
  const isBrandUsedInNotas = (brandName: string): boolean => {
    const notas = localStorage.getItem('nota-storage')
    if (!notas) return false
    
    try {
      const parsed = JSON.parse(notas)
      return parsed.some((n: any) => {
        if (n.subPesanan && Array.isArray(n.subPesanan)) {
          return n.subPesanan.some((sp: any) => sp.brand_sparepart === brandName)
        }
        return false
      })
    } catch {
      return false
    }
  }

  // BLUEPRINT: Get brand by ID
  const getBrandById = (id: string) => {
    return brands.find(b => b.id === id)
  }

  // BLUEPRINT: Get active brands (untuk dropdown di ProductForm)
  const activeBrands = brands.filter((b) => b.is_active)

  // BLUEPRINT: Get all brands
  const allBrands = brands

  // Get brands by tier
  const getBrandsByTier = (tier: SparepartBrand['tier']) => {
    return brands.filter(b => b.tier === tier)
  }

  return {
    brands: allBrands,
    activeBrands,
    isLoading,
    getBrandById,
    getBrandsByTier,
    createBrand,
    updateBrand,
    deleteBrand,
    isBrandUsedById,
    isBrandUsedByName,
    isBrandUsedInNotas,
  }
}
