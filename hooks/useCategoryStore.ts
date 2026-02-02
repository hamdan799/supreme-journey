// OriginalName: useCategoryStore
// ShortName: useCatStore

/**
 * BLUEPRINT: Category Management Hook
 * - CRUD operations untuk kategori sparepart
 * - Default categories untuk teknisi HP
 * - Validation rules (no duplicate, can't delete if used)
 * - Soft disable dengan is_active
 */

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner@2.0.3'
import type { Category } from '../types/inventory'

const STORAGE_KEY = 'pos_categories'

// BLUEPRINT: Daftar kategori realistis teknisi HP (default)
const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'created_at' | 'updated_at'>[] = [
  { name: 'Layar / LCD', description: 'Layar dan LCD', is_active: true },
  { name: 'Touchscreen', description: 'Touchscreen / digitizer', is_active: true },
  { name: 'Flexible Power', description: 'Flexible power button', is_active: true },
  { name: 'Flexible Volume', description: 'Flexible volume button', is_active: true },
  { name: 'Baterai', description: 'Baterai HP', is_active: true },
  { name: 'Backdoor', description: 'Tutup belakang HP', is_active: true },
  { name: 'Kamera Depan', description: 'Kamera depan / selfie', is_active: true },
  { name: 'Kamera Belakang', description: 'Kamera belakang / rear', is_active: true },
  { name: 'Speaker', description: 'Speaker buzzer', is_active: true },
  { name: 'Mic', description: 'Microphone', is_active: true },
  { name: 'PCB / Board', description: 'PCB / Mainboard', is_active: true },
  { name: 'Charger Port', description: 'Port charging / USB', is_active: true },
  { name: 'Konektor Baterai', description: 'Konektor baterai', is_active: true },
  { name: 'IC (Umum)', description: 'IC berbagai jenis', is_active: true },
  { name: 'Tempat Sim', description: 'Slot SIM card', is_active: true },
  { name: 'Frame', description: 'Frame / rangka HP', is_active: true },
  { name: 'Tombol Luar', description: 'Tombol fisik luar', is_active: true },
  { name: 'Stiker / Perekat', description: 'Stiker & perekat', is_active: true },
  { name: 'Pelindung', description: 'Pelindung layar, case, dll', is_active: true },
  { name: 'Universal / Misc', description: 'Sparepart universal & lainnya', is_active: true }
]

export function useCategoryStore() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load categories on mount
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setCategories(parsed)
      } else {
        // Initialize with default categories
        initializeDefaultCategories()
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Gagal memuat kategori')
    } finally {
      setIsLoading(false)
    }
  }

  const saveCategories = (cats: Category[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cats))
      setCategories(cats)
    } catch (error) {
      console.error('Error saving categories:', error)
      toast.error('Gagal menyimpan kategori')
    }
  }

  const initializeDefaultCategories = () => {
    const now = new Date().toISOString()
    const defaultCats: Category[] = DEFAULT_CATEGORIES.map((cat, index) => ({
      ...cat,
      id: `cat-default-${index + 1}`,
      created_at: now,
      updated_at: now
    }))
    saveCategories(defaultCats)
    toast.success('Kategori default berhasil dimuat')
  }

  // ===== CREATE =====
  const createCategory = useCallback((data: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    // RULE: Nama kategori tidak boleh duplikat
    const duplicate = categories.find(
      c => c.name.toLowerCase().trim() === data.name.toLowerCase().trim()
    )
    if (duplicate) {
      toast.error('Nama kategori sudah digunakan')
      return null
    }

    const now = new Date().toISOString()
    const newCategory: Category = {
      ...data,
      id: `cat-${Date.now()}`,
      created_at: now,
      updated_at: now
    }

    const updated = [...categories, newCategory]
    saveCategories(updated)
    toast.success(`Kategori "${data.name}" berhasil ditambahkan`)
    return newCategory
  }, [categories])

  // ===== UPDATE =====
  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    // RULE: Cek duplikasi nama jika nama diubah
    if (updates.name) {
      const duplicate = categories.find(
        c => c.id !== id && c.name.toLowerCase().trim() === updates.name!.toLowerCase().trim()
      )
      if (duplicate) {
        toast.error('Nama kategori sudah digunakan')
        return null
      }
    }

    const updated = categories.map(cat => {
      if (cat.id === id) {
        return {
          ...cat,
          ...updates,
          updated_at: new Date().toISOString()
        }
      }
      return cat
    })

    saveCategories(updated)
    toast.success('Kategori berhasil diupdate')
    return updated.find(c => c.id === id)
  }, [categories])

  // ===== DELETE =====
  const deleteCategory = useCallback((id: string) => {
    const updated = categories.filter(c => c.id !== id)
    saveCategories(updated)
    toast.success('Kategori berhasil dihapus')
  }, [categories])

  // ===== TOGGLE ACTIVE =====
  const toggleCategoryActive = useCallback((id: string) => {
    const category = categories.find(c => c.id === id)
    if (!category) return

    updateCategory(id, { is_active: !category.is_active })
    toast.success(
      category.is_active
        ? 'Kategori dinonaktifkan'
        : 'Kategori diaktifkan'
    )
  }, [categories, updateCategory])

  // ===== HELPER: Get active categories =====
  const getActiveCategories = useCallback(() => {
    return categories.filter(c => c.is_active)
  }, [categories])

  // ===== HELPER: Get category by ID =====
  const getCategoryById = useCallback((id: string) => {
    return categories.find(c => c.id === id)
  }, [categories])

  // ===== HELPER: Get category name by ID =====
  const getCategoryName = useCallback((id: string) => {
    return categories.find(c => c.id === id)?.name || 'Unknown'
  }, [categories])

  return {
    categories,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,
    getActiveCategories,
    getCategoryById,
    getCategoryName,
    reloadCategories: loadCategories
  }
}
