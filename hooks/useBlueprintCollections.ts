// OriginalName: useBlueprintCollections
// ShortName: useBlueprintColl

/**
 * BLUEPRINT: Hooks untuk manage collections baru
 * - phone_brands (addable)
 * - sparepart_brands (addable)
 * - phone_models (auto-recorded)
 * - repair_stats (analytics)
 * - brand_sparepart_stats (analytics)
 * - model_failure_stats (analytics)
 */

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import type { PhoneBrand, SparepartBrand, PhoneModel } from '../types/inventory'
import type { RepairStats, BrandSparepartStats, ModelFailureStats } from '../types/analytics'

const STORAGE_KEYS = {
  PHONE_BRANDS: 'blueprint_phone_brands',
  SPAREPART_BRANDS: 'blueprint_sparepart_brands',
  PHONE_MODELS: 'blueprint_phone_models',
  REPAIR_STATS: 'blueprint_repair_stats',
  BRAND_SPAREPART_STATS: 'blueprint_brand_sparepart_stats',
  MODEL_FAILURE_STATS: 'blueprint_model_failure_stats'
}

export function useBlueprintCollections() {
  const [phoneBrands, setPhoneBrands] = useState<PhoneBrand[]>([])
  const [sparepartBrands, setSparepartBrands] = useState<SparepartBrand[]>([])
  const [phoneModels, setPhoneModels] = useState<PhoneModel[]>([])
  const [repairStats, setRepairStats] = useState<RepairStats[]>([])
  const [brandSparepartStats, setBrandSparepartStats] = useState<BrandSparepartStats[]>([])
  const [modelFailureStats, setModelFailureStats] = useState<ModelFailureStats[]>([])

  // Load data on mount
  useEffect(() => {
    loadAllCollections()
  }, [])

  const loadAllCollections = () => {
    try {
      const localPhoneBrands = JSON.parse(localStorage.getItem(STORAGE_KEYS.PHONE_BRANDS) || '[]')
      const localSparepartBrands = JSON.parse(localStorage.getItem(STORAGE_KEYS.SPAREPART_BRANDS) || '[]')
      const localPhoneModels = JSON.parse(localStorage.getItem(STORAGE_KEYS.PHONE_MODELS) || '[]')
      const localRepairStats = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPAIR_STATS) || '[]')
      const localBrandSparepartStats = JSON.parse(localStorage.getItem(STORAGE_KEYS.BRAND_SPAREPART_STATS) || '[]')
      const localModelFailureStats = JSON.parse(localStorage.getItem(STORAGE_KEYS.MODEL_FAILURE_STATS) || '[]')

      setPhoneBrands(localPhoneBrands)
      setSparepartBrands(localSparepartBrands)
      setPhoneModels(localPhoneModels)
      setRepairStats(localRepairStats)
      setBrandSparepartStats(localBrandSparepartStats)
      setModelFailureStats(localModelFailureStats)

      // Initialize default data if empty
      if (localPhoneBrands.length === 0) {
        initializePhoneBrands()
      }
      if (localSparepartBrands.length === 0) {
        initializeSparepartBrands()
      }
    } catch (error) {
      console.error('Error loading blueprint collections:', error)
    }
  }

  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error)
      toast.error('Gagal menyimpan data')
    }
  }

  // Initialize default Phone Brands
  const initializePhoneBrands = () => {
    const defaultBrands: PhoneBrand[] = [
      { id: '1', name: 'Samsung', createdAt: new Date() },
      { id: '2', name: 'iPhone', createdAt: new Date() },
      { id: '3', name: 'Xiaomi', createdAt: new Date() },
      { id: '4', name: 'Oppo', createdAt: new Date() },
      { id: '5', name: 'Vivo', createdAt: new Date() },
      { id: '6', name: 'Realme', createdAt: new Date() },
      { id: '7', name: 'Huawei', createdAt: new Date() },
      { id: '8', name: 'Asus', createdAt: new Date() },
      { id: '9', name: 'Infinix', createdAt: new Date() },
      { id: '10', name: 'Tecno', createdAt: new Date() }
    ]
    setPhoneBrands(defaultBrands)
    saveToStorage(STORAGE_KEYS.PHONE_BRANDS, defaultBrands)
  }

  // Initialize default Sparepart Brands
  const initializeSparepartBrands = () => {
    const defaultBrands: SparepartBrand[] = [
      { id: '1', name: 'Original', origin: 'OEM', notes: 'Original manufacturer parts', createdAt: new Date() },
      { id: '2', name: 'KW Super', origin: 'China', notes: 'High quality aftermarket', createdAt: new Date() },
      { id: '3', name: 'KW', origin: 'China', notes: 'Standard aftermarket', createdAt: new Date() },
      { id: '4', name: 'OEM', origin: 'Various', notes: 'OEM quality replacement', createdAt: new Date() },
      { id: '5', name: 'Refurbished', origin: 'Various', notes: 'Reconditioned parts', createdAt: new Date() }
    ]
    setSparepartBrands(defaultBrands)
    saveToStorage(STORAGE_KEYS.SPAREPART_BRANDS, defaultBrands)
  }

  // ===== PHONE BRANDS CRUD =====
  const createPhoneBrand = useCallback((name: string) => {
    // Check if already exists
    const exists = phoneBrands.find(b => b.name.toLowerCase() === name.toLowerCase())
    if (exists) {
      toast.error('Brand HP sudah ada')
      return null
    }

    const newBrand: PhoneBrand = {
      id: Date.now().toString(),
      name,
      createdAt: new Date()
    }

    const updated = [...phoneBrands, newBrand]
    setPhoneBrands(updated)
    saveToStorage(STORAGE_KEYS.PHONE_BRANDS, updated)
    toast.success(`Brand HP "${name}" berhasil ditambahkan`)
    return newBrand
  }, [phoneBrands])

  const deletePhoneBrand = useCallback((id: string) => {
    const updated = phoneBrands.filter(b => b.id !== id)
    setPhoneBrands(updated)
    saveToStorage(STORAGE_KEYS.PHONE_BRANDS, updated)
    toast.success('Brand HP berhasil dihapus')
  }, [phoneBrands])

  // ===== SPAREPART BRANDS CRUD =====
  const createSparepartBrand = useCallback((name: string, origin?: string, notes?: string) => {
    // Check if already exists
    const exists = sparepartBrands.find(b => b.name.toLowerCase() === name.toLowerCase())
    if (exists) {
      toast.error('Brand Sparepart sudah ada')
      return null
    }

    const newBrand: SparepartBrand = {
      id: Date.now().toString(),
      name,
      origin,
      notes,
      createdAt: new Date()
    }

    const updated = [...sparepartBrands, newBrand]
    setSparepartBrands(updated)
    saveToStorage(STORAGE_KEYS.SPAREPART_BRANDS, updated)
    toast.success(`Brand Sparepart "${name}" berhasil ditambahkan`)
    return newBrand
  }, [sparepartBrands])

  const deleteSparepartBrand = useCallback((id: string) => {
    const updated = sparepartBrands.filter(b => b.id !== id)
    setSparepartBrands(updated)
    saveToStorage(STORAGE_KEYS.SPAREPART_BRANDS, updated)
    toast.success('Brand Sparepart berhasil dihapus')
  }, [sparepartBrands])

  // ===== PHONE MODELS (Auto-recorded) =====
  const recordPhoneModel = useCallback((brand: string, model: string, fromProductId?: string, fromServiceId?: string) => {
    // Check if already exists
    const exists = phoneModels.find(m => 
      m.brand.toLowerCase() === brand.toLowerCase() && 
      m.model.toLowerCase() === model.toLowerCase()
    )
    
    if (exists) {
      return exists // Already recorded
    }

    const newModel: PhoneModel = {
      id: Date.now().toString(),
      brand,
      model,
      created_from_product_id: fromProductId,
      created_from_service_id: fromServiceId,
      createdAt: new Date()
    }

    const updated = [...phoneModels, newModel]
    setPhoneModels(updated)
    saveToStorage(STORAGE_KEYS.PHONE_MODELS, updated)
    console.log(`📱 Phone model recorded: ${brand} ${model}`)
    return newModel
  }, [phoneModels])

  // ===== ANALYTICS HELPERS =====
  const updateRepairStats = useCallback((modelHp: string, brandHp: string, serviceData: any) => {
    // Find or create repair stats for this model
    const existing = repairStats.find(s => s.model_hp === modelHp)
    
    if (existing) {
      // Update existing stats
      const updated = repairStats.map(s => {
        if (s.model_hp === modelHp) {
          return {
            ...s,
            total_repair: s.total_repair + 1,
            updatedAt: new Date()
            // TODO: Calculate success rate, average cost, etc based on serviceData
          }
        }
        return s
      })
      setRepairStats(updated)
      saveToStorage(STORAGE_KEYS.REPAIR_STATS, updated)
    } else {
      // Create new stats
      const newStats: RepairStats = {
        id: Date.now().toString(),
        model_hp: modelHp,
        brand_hp: brandHp,
        total_repair: 1,
        success_rate: 100, // Default optimistic
        average_cost: serviceData.totalCost || 0,
        sparepart_failure_rate: {},
        common_damage: serviceData.keluhan_tags || [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const updated = [...repairStats, newStats]
      setRepairStats(updated)
      saveToStorage(STORAGE_KEYS.REPAIR_STATS, updated)
    }
  }, [repairStats])

  return {
    // Collections
    phoneBrands,
    sparepartBrands,
    phoneModels,
    repairStats,
    brandSparepartStats,
    modelFailureStats,

    // Phone Brands CRUD
    createPhoneBrand,
    deletePhoneBrand,

    // Sparepart Brands CRUD
    createSparepartBrand,
    deleteSparepartBrand,

    // Phone Models Auto-record
    recordPhoneModel,

    // Analytics
    updateRepairStats,

    // Reload
    reloadCollections: loadAllCollections
  }
}
