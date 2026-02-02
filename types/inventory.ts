export interface Product {
  id: string
  name: string
  description?: string
  
  // Category
  category: string // Backward compatibility
  categoryId?: string
  category_id?: string // New field (prefer this)
  subCategoryId?: string
  
  // Stock & Pricing
  stock: number // Backward compatibility
  stock_qty?: number // New field (prefer this)
  price: number // Harga jual (backward compatibility)
  selling_price?: number // New field (prefer this)
  cost?: number // Harga modal (backward compatibility)
  purchase_price?: number // New field (prefer this)
  minStock?: number // Backward compatibility
  min_stock_alert?: number // New field (prefer this)
  
  // SKU & Barcode
  barcode?: string
  sku?: string
  
  // Supplier (backward compatibility)
  supplier?: string
  supplierId?: string
  supplierContact?: string
  
  // 🟦 HELPER KOMPATIBILITAS (OPERASIONAL - BUKAN AI)
  // Helper untuk SEARCH & FILTER cepat (kasir/teknisi)
  // TIDAK dipakai untuk AI analysis, TIDAK jadi master data
  helper_brand_hp?: string | null    // Brand HP (dropdown dari Brand HP)
  helper_model_text?: string | null  // Model HP (TEXT BEBAS: "A12", "A12/A13", "Universal Samsung")
  
  // 🔷 BLUEPRINT: KOMPATIBILITAS AI (DERIVED ONLY - READ-ONLY)
  // Kompatibilitas dihitung otomatis dari riwayat pemakaian di nota service
  // TIDAK BOLEH di-input manual, TIDAK BOLEH di-edit
  compatibility_hint?: CompatibilityHint[]
  
  // 🗑️ DEPRECATED: Manual compatibility fields (akan dihapus)
  // Kept for backward compatibility during migration
  compatible_brands?: string[]
  compatible_models?: string[]
  custom_model_raw?: string[]
  is_universal?: boolean
  
  // Brand Sparepart
  brand_sparepart?: string | null // Brand sparepart name (backward compatibility)
  brand_sparepart_id?: string | null // New field (prefer this)
  sparepart_quality?: SparepartQuality
  sparepart_type?: 'brand' | 'brandless'
  
  // Vendor
  vendor_id?: string | null
  
  // Notes
  notes?: string // Catatan teknis (ex: "LCD ini mudah pecak", "Stok terbatas")
  
  // Metadata
  storeId?: string
  userId?: string
  createdAt: Date
  updatedAt: Date
}

// 🔷 BLUEPRINT: Compatibility Hint (AI-Derived, Read-Only)
export interface CompatibilityHint {
  brand: string          // Brand HP (Samsung, Xiaomi, etc)
  model: string          // Model HP (A12, Redmi Note 9, etc)
  confidence: number     // 0-100 (berdasarkan frekuensi pemakaian)
  usage_count: number    // Berapa kali dipakai untuk device ini
  last_used_at: Date     // Terakhir dipakai kapan
  source: 'service-history' // Sumber data (saat ini hanya dari service)
}

// BLUEPRINT: Sparepart Quality Grades (Static Enum)
export type SparepartQuality = 'Grade S' | 'Grade A' | 'Grade B' | 'Grade C' | 'Grade D' | 'Anomali' | null

// BLUEPRINT: Phone Brand (Addable Collection)
export interface PhoneBrand {
  id: string
  name: string // e.g., "Samsung", "Xiaomi", "iPhone"
  slug: string // Auto-generated: "samsung", "xiaomi", "iphone"
  is_active: boolean // false = tidak muncul di form Device Model (soft-disable)
  notes?: string // Catatan internal (opsional)
  
  // DEPRECATED: For backward compatibility only
  archived?: boolean // Legacy field, use is_active instead
  
  createdAt: Date
  updatedAt: Date
}

// BLUEPRINT: Phone Model (Auto-recorded from Product & Service)
export interface PhoneModel {
  id: string
  brand: string // Brand HP
  model: string // Model HP
  created_from_product_id?: string // Tracking origin
  created_from_service_id?: string
  createdAt: Date
}

// BLUEPRINT: Sparepart Brand (Addable Collection)
export interface SparepartBrand {
  id: string
  name: string // e.g., "Vizz", "iMax", "M-Tri", "OEM", "Original"
  description?: string | null
  tier: 'ori' | 'oem' | 'premium' | 'kw' | 'unknown' // Quality tier
  is_active: boolean // Untuk soft-disable brand
  created_at: string
  updated_at: string
}

// Legacy alias for backward compatibility
export type BrandSparepart = SparepartBrand

export interface Category {
  id: string
  name: string               // Nama kategori, wajib unik
  description?: string       // Optional
  is_active: boolean         // Untuk soft-disable kategori
  created_at: string
  updated_at: string
}

export interface SubCategory {
  id: string
  name: string
  description?: string
  parentCategoryId: string
  createdAt: Date
  updatedAt: Date
}

export interface StockLog {
  id: string
  productId: string
  productName: string
  jumlah: number
  type: 'masuk' | 'keluar'
  reference: string
  supplier?: string // New: Supplier for stock in
  keterangan?: string // New: Notes for stock movement
  tanggal: Date
  storeId?: string
  createdAt: Date
}

// 🆕 BLUEPRINT: Stock Ledger Type (JANTUNG SISTEM STOK)
export type StockLedgerType = 'IN' | 'OUT' | 'ADJUST' | 'RESERVE' | 'RELEASE'

// 🆕 BLUEPRINT: Stock Reference Type
export type StockRefType = 'service' | 'sale' | 'adjustment' | 'purchase' | 'correction' | 'return'

// 🆕 BLUEPRINT: Stock Ledger (Event-based Stock Movement)
export interface StockLedger {
  id: string
  product_id: string
  product_name: string // Snapshot untuk display
  qty_change: number // + atau - (positive untuk IN/RESERVE, negative untuk OUT)
  type: StockLedgerType
  ref_type: StockRefType
  ref_id?: string // ID nota service / transaksi / adjustment
  note?: string // WAJIB untuk manual adjustment
  user_id?: string
  user_name?: string // Snapshot untuk audit
  created_at: Date
  storeId?: string
}

// 🆕 BLUEPRINT: Stock Adjustment (Manual Stock Correction)
export interface StockAdjustment {
  id: string
  product_id: string
  qty_before: number
  qty_after: number
  qty_change: number
  reason: 'physical_count' | 'damaged' | 'lost' | 'expired' | 'correction' | 'other'
  reason_note: string // WAJIB - alasan detail
  user_id?: string
  user_name?: string
  created_at: Date
  storeId?: string
}

// 🆕 BLUEPRINT: Stock Status (untuk UI display)
export interface StockStatus {
  available: number // Stok tersedia (stock_qty - reserved)
  reserved: number // Stok yang di-reserve nota service
  total: number // Total stok (stock_qty)
  min_alert: number // Minimum stok
  status: 'safe' | 'low' | 'out' // Aman / Menipis / Habis
}

export interface Receipt {
  id: string
  productId?: string
  productName?: string
  jumlah?: number
  harga?: number
  total?: number
  type?: string
  quantity?: number
  tanggal: Date
  storeId?: string
  userId?: string
  createdAt?: Date
}

// New: Contact type for customers and suppliers
export interface Contact {
  id: string
  name: string
  phone?: string
  email?: string
  address?: string
  type: 'customer' | 'supplier' | 'vendor' | 'both'
  notes?: string
  storeId?: string
  userId?: string
  createdAt: Date
  updatedAt: Date
}

// New: User role type for Owner/Kasir mode
export interface UserRole {
  mode: 'owner' | 'kasir'
  pin?: string // PIN for owner mode
}

// New: Store info with role
export interface StoreInfo {
  storeName: string
  storeAddress?: string
  storePhone?: string
  storeLogo?: string
  userRole: UserRole
  autoLockMinutes?: number // Auto-lock for kasir mode
  createdAt?: Date
  updatedAt?: Date
}

// Task #15: Vendor Management
export interface Vendor {
  id: string
  nama_vendor: string
  kontak?: string // Phone number
  email?: string
  alamat?: string
  catatan?: string
  storeId?: string
  userId?: string
  createdAt: Date
  updatedAt: Date
}