// OriginalName: useStockLedger
// ShortName: StockLedger

import { useState, useCallback, useMemo } from 'react'
import type { 
  StockLedger, 
  StockAdjustment, 
  StockLedgerType, 
  StockRefType,
  StockStatus,
  Product 
} from '../types/inventory'

/**
 * 🔷 BLUEPRINT: useStockLedger Hook
 * 
 * Hook ini adalah JANTUNG sistem stok.
 * Semua perubahan stok WAJIB melalui hook ini.
 * 
 * PRINSIP:
 * - Stok tidak boleh berubah tanpa sebab
 * - Setiap perubahan stok = event di StockLedger
 * - product.stock_qty = hasil agregasi, bukan field yang di-edit langsung
 */

interface UseStockLedgerReturn {
  ledgers: StockLedger[]
  adjustments: StockAdjustment[]
  
  // Stock Status Calculator
  getStockStatus: (productId: string) => StockStatus
  
  // Ledger Actions (CORE)
  recordStockIn: (productId: string, qty: number, refType: StockRefType, refId?: string, note?: string) => void
  recordStockOut: (productId: string, qty: number, refType: StockRefType, refId?: string, note?: string) => void
  recordStockReserve: (productId: string, qty: number, refId: string, note?: string) => void
  recordStockRelease: (productId: string, qty: number, refId: string, note?: string) => void
  
  // Manual Adjustment (DANGEROUS - requires auth)
  recordAdjustment: (
    productId: string, 
    qtyAfter: number, 
    reason: StockAdjustment['reason'], 
    reasonNote: string
  ) => void
  
  // Query Helpers
  getLedgersByProduct: (productId: string) => StockLedger[]
  getLedgersByRef: (refType: StockRefType, refId: string) => StockLedger[]
  getReservedQty: (productId: string) => number
}

export function useStockLedger(
  products: Product[],
  onProductUpdate: (id: string, updates: Partial<Product>) => void
): UseStockLedgerReturn {
  // Mock data for now - nanti ini akan ke localStorage/Supabase
  const [ledgers, setLedgers] = useState<StockLedger[]>([])
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([])

  /**
   * 🔹 Get Stock Status
   * Menghitung stok tersedia, reserved, dan status
   */
  const getStockStatus = useCallback((productId: string): StockStatus => {
    const product = products.find(p => p.id === productId)
    if (!product) {
      return { available: 0, reserved: 0, total: 0, min_alert: 0, status: 'out' }
    }

    const total = product.stock_qty ?? product.stock ?? 0
    const minAlert = product.min_stock_alert ?? product.minStock ?? 0
    
    // Hitung reserved dari ledger
    const reserved = ledgers
      .filter(l => l.product_id === productId && l.type === 'RESERVE')
      .reduce((sum, l) => sum + l.qty_change, 0)
    
    // Hitung released (cancel reserve)
    const released = ledgers
      .filter(l => l.product_id === productId && l.type === 'RELEASE')
      .reduce((sum, l) => sum + Math.abs(l.qty_change), 0)
    
    const actualReserved = Math.max(0, reserved - released)
    const available = Math.max(0, total - actualReserved)
    
    let status: StockStatus['status'] = 'safe'
    if (total === 0) {
      status = 'out'
    } else if (total <= minAlert) {
      status = 'low'
    }

    return { available, reserved: actualReserved, total, min_alert: minAlert, status }
  }, [products, ledgers])

  /**
   * 🔹 Record Stock IN
   * Untuk: Pembelian, Restok, Return
   */
  const recordStockIn = useCallback((
    productId: string, 
    qty: number, 
    refType: StockRefType, 
    refId?: string, 
    note?: string
  ) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    const newLedger: StockLedger = {
      id: `ledger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      product_id: productId,
      product_name: product.name,
      qty_change: qty,
      type: 'IN',
      ref_type: refType,
      ref_id: refId,
      note,
      user_name: 'Current User', // TODO: Get from auth
      created_at: new Date(),
    }

    setLedgers(prev => [...prev, newLedger])

    // Update product stock
    const currentStock = product.stock_qty ?? product.stock ?? 0
    onProductUpdate(productId, {
      stock_qty: currentStock + qty,
      stock: currentStock + qty, // Backward compatibility
      updatedAt: new Date()
    })
  }, [products, onProductUpdate])

  /**
   * 🔹 Record Stock OUT
   * Untuk: Penjualan, Nota Service Selesai (dipakai)
   */
  const recordStockOut = useCallback((
    productId: string, 
    qty: number, 
    refType: StockRefType, 
    refId?: string, 
    note?: string
  ) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    const currentStock = product.stock_qty ?? product.stock ?? 0
    if (currentStock < qty) {
      throw new Error(`Stok tidak cukup. Tersedia: ${currentStock}, Dibutuhkan: ${qty}`)
    }

    const newLedger: StockLedger = {
      id: `ledger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      product_id: productId,
      product_name: product.name,
      qty_change: -qty, // Negative untuk OUT
      type: 'OUT',
      ref_type: refType,
      ref_id: refId,
      note,
      user_name: 'Current User',
      created_at: new Date(),
    }

    setLedgers(prev => [...prev, newLedger])

    // Update product stock
    onProductUpdate(productId, {
      stock_qty: currentStock - qty,
      stock: currentStock - qty,
      updatedAt: new Date()
    })
  }, [products, onProductUpdate])

  /**
   * 🔹 Record Stock RESERVE
   * Untuk: Nota Service status "Proses"
   * PENTING: Ini tidak mengurangi stock_qty, tapi mengurangi "available"
   */
  const recordStockReserve = useCallback((
    productId: string, 
    qty: number, 
    refId: string, 
    note?: string
  ) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    const status = getStockStatus(productId)
    if (status.available < qty) {
      throw new Error(`Stok tersedia tidak cukup. Tersedia: ${status.available}, Dibutuhkan: ${qty}`)
    }

    const newLedger: StockLedger = {
      id: `ledger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      product_id: productId,
      product_name: product.name,
      qty_change: qty, // Positive karena reserved
      type: 'RESERVE',
      ref_type: 'service',
      ref_id: refId,
      note: note || 'Reserved untuk nota service',
      user_name: 'Current User',
      created_at: new Date(),
    }

    setLedgers(prev => [...prev, newLedger])
    // TIDAK update product.stock_qty
  }, [products, getStockStatus])

  /**
   * 🔹 Record Stock RELEASE
   * Untuk: Nota Service batal / item tidak jadi dipakai
   */
  const recordStockRelease = useCallback((
    productId: string, 
    qty: number, 
    refId: string, 
    note?: string
  ) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    const newLedger: StockLedger = {
      id: `ledger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      product_id: productId,
      product_name: product.name,
      qty_change: -qty, // Negative untuk release
      type: 'RELEASE',
      ref_type: 'service',
      ref_id: refId,
      note: note || 'Release reserve nota service',
      user_name: 'Current User',
      created_at: new Date(),
    }

    setLedgers(prev => [...prev, newLedger])
    // TIDAK update product.stock_qty
  }, [products])

  /**
   * 🔹 Record Manual Adjustment
   * PENTING: Hanya untuk koreksi manual dengan alasan jelas
   */
  const recordAdjustment = useCallback((
    productId: string, 
    qtyAfter: number, 
    reason: StockAdjustment['reason'], 
    reasonNote: string
  ) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    if (!reasonNote || reasonNote.trim().length < 10) {
      throw new Error('Alasan adjustment harus minimal 10 karakter')
    }

    const qtyBefore = product.stock_qty ?? product.stock ?? 0
    const qtyChange = qtyAfter - qtyBefore

    // Create adjustment record
    const newAdjustment: StockAdjustment = {
      id: `adj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      product_id: productId,
      qty_before: qtyBefore,
      qty_after: qtyAfter,
      qty_change: qtyChange,
      reason,
      reason_note: reasonNote,
      user_name: 'Current User',
      created_at: new Date(),
    }

    setAdjustments(prev => [...prev, newAdjustment])

    // Create ledger entry
    const newLedger: StockLedger = {
      id: `ledger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      product_id: productId,
      product_name: product.name,
      qty_change: qtyChange,
      type: 'ADJUST',
      ref_type: 'adjustment',
      ref_id: newAdjustment.id,
      note: `[${reason}] ${reasonNote}`,
      user_name: 'Current User',
      created_at: new Date(),
    }

    setLedgers(prev => [...prev, newLedger])

    // Update product stock
    onProductUpdate(productId, {
      stock_qty: qtyAfter,
      stock: qtyAfter,
      updatedAt: new Date()
    })
  }, [products, onProductUpdate])

  /**
   * 🔹 Get Ledgers by Product
   */
  const getLedgersByProduct = useCallback((productId: string) => {
    return ledgers
      .filter(l => l.product_id === productId)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
  }, [ledgers])

  /**
   * 🔹 Get Ledgers by Reference
   */
  const getLedgersByRef = useCallback((refType: StockRefType, refId: string) => {
    return ledgers
      .filter(l => l.ref_type === refType && l.ref_id === refId)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
  }, [ledgers])

  /**
   * 🔹 Get Reserved Quantity
   */
  const getReservedQty = useCallback((productId: string) => {
    const status = getStockStatus(productId)
    return status.reserved
  }, [getStockStatus])

  return {
    ledgers,
    adjustments,
    getStockStatus,
    recordStockIn,
    recordStockOut,
    recordStockReserve,
    recordStockRelease,
    recordAdjustment,
    getLedgersByProduct,
    getLedgersByRef,
    getReservedQty,
  }
}
