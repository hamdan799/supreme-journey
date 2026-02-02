// OriginalName: useCompatibilityTracker
// ShortName: CompTracker

/**
 * 🔷 BLUEPRINT: KOMPATIBILITAS AI (EVENT-BASED)
 * 
 * Hook ini untuk tracking kompatibilitas sparepart dengan device.
 * 
 * PRINSIP:
 * - Kompatibilitas BUKAN master data
 * - Kompatibilitas = hasil observasi pemakaian nyata
 * - Data tumbuh otomatis dari nota service selesai
 * - TIDAK ADA input manual
 * - TIDAK ADA edit
 * 
 * SUMBER DATA:
 * - Nota service dengan status "Diambil" (selesai)
 * - Brand HP + Model HP dari nota
 * - Sparepart yang dipakai (sub pesanan)
 */

import { useCallback } from 'react'
import type { Product, CompatibilityHint } from '../types/inventory'

const STORAGE_KEY = 'compatibility-events'

/**
 * 🔷 Usage Event
 * Event saat sparepart dipakai di nota service
 */
interface UsageEvent {
  id: string
  product_id: string
  brand: string      // Brand HP dari nota
  model: string      // Model HP dari nota
  service_id: string // ID nota service
  created_at: Date
}

interface UseCompatibilityTrackerReturn {
  // Record usage event (dipanggil saat nota selesai)
  recordUsageEvent: (productId: string, brand: string, model: string, serviceId: string) => void
  
  // Get compatibility hints untuk product tertentu
  getCompatibilityHints: (productId: string) => CompatibilityHint[]
  
  // Get compatibility untuk semua products (untuk update bulk)
  calculateAllCompatibilities: (products: Product[]) => Map<string, CompatibilityHint[]>
}

export function useCompatibilityTracker(): UseCompatibilityTrackerReturn {
  /**
   * 🔹 Load events from localStorage
   */
  const loadEvents = useCallback((): UsageEvent[] => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    try {
      const parsed = JSON.parse(stored)
      return parsed.map((e: any) => ({
        ...e,
        created_at: new Date(e.created_at)
      }))
    } catch (error) {
      console.error('Failed to parse compatibility events:', error)
      return []
    }
  }, [])

  /**
   * 🔹 Save events to localStorage
   */
  const saveEvents = useCallback((events: UsageEvent[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  }, [])

  /**
   * 🔹 Record Usage Event
   * Dipanggil saat nota service status berubah ke "Diambil"
   */
  const recordUsageEvent = useCallback((
    productId: string,
    brand: string,
    model: string,
    serviceId: string
  ) => {
    // Validasi input
    if (!productId || !brand || !model || !serviceId) {
      console.warn('Incomplete usage event data, skipping')
      return
    }

    const events = loadEvents()
    
    // Cek apakah event sudah ada (avoid duplicate)
    const isDuplicate = events.some(
      e => e.product_id === productId && e.service_id === serviceId
    )
    
    if (isDuplicate) {
      console.log('Usage event already recorded, skipping')
      return
    }

    const newEvent: UsageEvent = {
      id: `usage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      product_id: productId,
      brand: brand.trim(),
      model: model.trim(),
      service_id: serviceId,
      created_at: new Date()
    }

    saveEvents([...events, newEvent])
    console.log('✅ Compatibility usage event recorded:', {
      product_id: productId,
      brand,
      model,
      service_id: serviceId
    })
  }, [loadEvents, saveEvents])

  /**
   * 🔹 Calculate Confidence Score
   * Confidence = usage_count / total_usage * 100
   * 
   * Misal:
   * - Product A dipakai 10x
   * - 7x untuk Samsung A12
   * - 2x untuk Redmi Note 9
   * - 1x untuk Oppo A5s
   * 
   * Confidence:
   * - Samsung A12: 70%
   * - Redmi Note 9: 20%
   * - Oppo A5s: 10%
   */
  const calculateConfidence = useCallback((
    usageCount: number,
    totalUsage: number
  ): number => {
    if (totalUsage === 0) return 0
    return Math.round((usageCount / totalUsage) * 100)
  }, [])

  /**
   * 🔹 Get Compatibility Hints for Single Product
   */
  const getCompatibilityHints = useCallback((productId: string): CompatibilityHint[] => {
    const events = loadEvents()
    
    // Filter events untuk product ini
    const productEvents = events.filter(e => e.product_id === productId)
    
    if (productEvents.length === 0) {
      return []
    }

    // Group by (brand, model)
    const groupMap = new Map<string, UsageEvent[]>()
    
    productEvents.forEach(event => {
      const key = `${event.brand}|${event.model}`
      const existing = groupMap.get(key) || []
      groupMap.set(key, [...existing, event])
    })

    // Calculate hints
    const totalUsage = productEvents.length
    const hints: CompatibilityHint[] = []

    groupMap.forEach((groupEvents, key) => {
      const [brand, model] = key.split('|')
      const usageCount = groupEvents.length
      const confidence = calculateConfidence(usageCount, totalUsage)
      
      // Urutkan untuk dapatkan last_used_at
      const sortedEvents = [...groupEvents].sort(
        (a, b) => b.created_at.getTime() - a.created_at.getTime()
      )
      
      hints.push({
        brand,
        model,
        confidence,
        usage_count: usageCount,
        last_used_at: sortedEvents[0].created_at,
        source: 'service-history'
      })
    })

    // Sort by confidence (highest first)
    return hints.sort((a, b) => b.confidence - a.confidence)
  }, [loadEvents, calculateConfidence])

  /**
   * 🔹 Calculate Compatibility untuk Semua Products
   * Untuk bulk update saat migration atau recalculation
   */
  const calculateAllCompatibilities = useCallback((
    products: Product[]
  ): Map<string, CompatibilityHint[]> => {
    const compatibilityMap = new Map<string, CompatibilityHint[]>()
    
    products.forEach(product => {
      const hints = getCompatibilityHints(product.id)
      if (hints.length > 0) {
        compatibilityMap.set(product.id, hints)
      }
    })
    
    return compatibilityMap
  }, [getCompatibilityHints])

  return {
    recordUsageEvent,
    getCompatibilityHints,
    calculateAllCompatibilities
  }
}
