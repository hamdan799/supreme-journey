/**
 * Sparepart Category Rules
 * Based on Master Blueprint - Section 3: BEHAVIOR FIELD BERDASARKAN KATEGORI
 * 
 * Tipe Sparepart:
 * 1. Brand-Based: Punya brand sparepart, vendor optional, supplier optional
 * 2. Vendor-Based: Vendor wajib, brand optional, supplier optional  
 * 3. Generic: Tanpa brand & vendor, supplier optional
 */

export type SparepartType = 'brand-based' | 'vendor-based' | 'generic'

export interface CategoryRule {
  category: string
  type: SparepartType
  brandSparepartRequired: boolean
  brandSparepartVisible: boolean
  vendorRequired: boolean
  vendorVisible: boolean
  supplierRequired: boolean
  supplierVisible: boolean
  defaultBrandSparepart?: string
  defaultVendor?: string
  hint?: string
}

/**
 * Master Category Rules
 * Aturan untuk setiap kategori sparepart
 */
export const CATEGORY_RULES: CategoryRule[] = [
  // ===== BRAND-BASED SPAREPART =====
  {
    category: 'LCD',
    type: 'brand-based',
    brandSparepartRequired: false, // Changed to false - allow empty for flexibility
    brandSparepartVisible: true,
    vendorRequired: false, // Changed to false - allow empty for flexibility
    vendorVisible: true,
    supplierRequired: false,
    supplierVisible: true,
    hint: 'LCD - Brand sparepart dan vendor direkomendasikan'
  },
  {
    category: 'Battery',
    type: 'brand-based',
    brandSparepartRequired: false, // Changed to false - allow empty for flexibility
    brandSparepartVisible: true,
    vendorRequired: false, // Changed to false - allow empty for flexibility
    vendorVisible: true,
    supplierRequired: false,
    supplierVisible: true,
    hint: 'Baterai - Brand sparepart dan vendor direkomendasikan'
  },
  {
    category: 'Backdoor',
    type: 'brand-based',
    brandSparepartRequired: false, // Changed to false - allow empty for flexibility
    brandSparepartVisible: true,
    vendorRequired: false,
    vendorVisible: true,
    supplierRequired: false,
    supplierVisible: true,
    hint: 'Backdoor - Brand sparepart direkomendasikan, vendor opsional'
  },
  {
    category: 'Kamera',
    type: 'brand-based',
    brandSparepartRequired: false, // Changed to false - allow empty for flexibility
    brandSparepartVisible: true,
    vendorRequired: false,
    vendorVisible: true,
    supplierRequired: false,
    supplierVisible: true,
    hint: 'Kamera - Brand sparepart direkomendasikan, vendor opsional'
  },
  
  // ===== GENERIC SPAREPART (Brandless & Vendorless) =====
  {
    category: 'Flexible',
    type: 'generic',
    brandSparepartRequired: false,
    brandSparepartVisible: false,
    vendorRequired: false,
    vendorVisible: false,
    supplierRequired: false,
    supplierVisible: true,
    defaultBrandSparepart: '-- Tidak Ada --',
    defaultVendor: null,
    hint: 'Flexible adalah generic part, tidak perlu brand/vendor'
  },
  {
    category: 'IC',
    type: 'generic',
    brandSparepartRequired: false,
    brandSparepartVisible: false,
    vendorRequired: false,
    vendorVisible: false,
    supplierRequired: false,
    supplierVisible: true,
    defaultBrandSparepart: '-- Tidak Ada --',
    defaultVendor: null,
    hint: 'IC adalah generic part, tidak perlu brand/vendor'
  },
  {
    category: 'Konektor',
    type: 'generic',
    brandSparepartRequired: false,
    brandSparepartVisible: false,
    vendorRequired: false,
    vendorVisible: false,
    supplierRequired: false,
    supplierVisible: true,
    defaultBrandSparepart: '-- Tidak Ada --',
    defaultVendor: null,
    hint: 'Konektor adalah generic part, tidak perlu brand/vendor'
  },
  {
    category: 'Kabel',
    type: 'generic',
    brandSparepartRequired: false,
    brandSparepartVisible: false,
    vendorRequired: false,
    vendorVisible: false,
    supplierRequired: false,
    supplierVisible: true,
    defaultBrandSparepart: '-- Tidak Ada --',
    defaultVendor: null,
    hint: 'Kabel adalah generic part, tidak perlu brand/vendor'
  },
  {
    category: 'Speaker',
    type: 'generic',
    brandSparepartRequired: false,
    brandSparepartVisible: false,
    vendorRequired: false,
    vendorVisible: false,
    supplierRequired: false,
    supplierVisible: true,
    defaultBrandSparepart: '-- Tidak Ada --',
    defaultVendor: null,
    hint: 'Speaker/mesh adalah generic part, tidak perlu brand/vendor'
  },
  {
    category: 'Vibrator',
    type: 'generic',
    brandSparepartRequired: false,
    brandSparepartVisible: false,
    vendorRequired: false,
    vendorVisible: false,
    supplierRequired: false,
    supplierVisible: true,
    defaultBrandSparepart: '-- Tidak Ada --',
    defaultVendor: null,
    hint: 'Vibrator adalah generic part, tidak perlu brand/vendor'
  },
  {
    category: 'Alat & Bahan',
    type: 'generic',
    brandSparepartRequired: false,
    brandSparepartVisible: false,
    vendorRequired: false,
    vendorVisible: false,
    supplierRequired: false,
    supplierVisible: true,
    defaultBrandSparepart: '-- Tidak Ada --',
    defaultVendor: null,
    hint: 'Alat & Bahan (lem, alkohol, dll) tidak perlu brand/vendor'
  },
  {
    category: 'Lain-lain',
    type: 'generic',
    brandSparepartRequired: false,
    brandSparepartVisible: false,
    vendorRequired: false,
    vendorVisible: false,
    supplierRequired: false,
    supplierVisible: true,
    defaultBrandSparepart: '-- Tidak Ada --',
    defaultVendor: null,
    hint: 'Kategori lain-lain tidak perlu brand/vendor'
  }
]

/**
 * Get category rules for a specific category
 */
export function getCategoryRules(categoryName: string): CategoryRule {
  const rule = CATEGORY_RULES.find(
    r => r.category.toLowerCase() === categoryName.toLowerCase()
  )
  
  // Default rules if category not found
  if (!rule) {
    return {
      category: categoryName,
      type: 'brand-based',
      brandSparepartRequired: false,
      brandSparepartVisible: true,
      vendorRequired: false,
      vendorVisible: true,
      supplierRequired: false,
      supplierVisible: true,
      hint: 'Kategori tidak dikenali, semua field opsional'
    }
  }
  
  return rule
}

/**
 * Detect sparepart type from category
 */
export function detectSparepartType(categoryName: string): SparepartType {
  const rule = getCategoryRules(categoryName)
  return rule.type
}

/**
 * Check if category is generic sparepart
 */
export function isGenericSparepart(categoryName: string): boolean {
  return detectSparepartType(categoryName) === 'generic'
}

/**
 * Get default values for a category
 */
export function getCategoryDefaults(categoryName: string): {
  brand_sparepart?: string | null
  vendor_id?: string | null
} {
  const rule = getCategoryRules(categoryName)
  
  return {
    brand_sparepart: rule.defaultBrandSparepart || null,
    vendor_id: rule.defaultVendor || null
  }
}

/**
 * Validate product based on category rules
 */
export function validateProductByCategory(
  categoryName: string,
  product: {
    brand_sparepart?: string
    vendor_id?: string
    supplier?: string
  }
): { valid: boolean; errors: string[] } {
  const rule = getCategoryRules(categoryName)
  const errors: string[] = []
  
  // Check brand sparepart
  if (rule.brandSparepartRequired && !product.brand_sparepart) {
    errors.push(`Brand sparepart wajib diisi untuk kategori ${categoryName}`)
  }
  
  // Check vendor
  if (rule.vendorRequired && !product.vendor_id) {
    errors.push(`Vendor wajib diisi untuk kategori ${categoryName}`)
  }
  
  // Check supplier
  if (rule.supplierRequired && !product.supplier) {
    errors.push(`Supplier wajib diisi untuk kategori ${categoryName}`)
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Get list of generic categories
 */
export function getGenericCategories(): string[] {
  return CATEGORY_RULES
    .filter(r => r.type === 'generic')
    .map(r => r.category)
}

/**
 * Get list of brand-based categories
 */
export function getBrandBasedCategories(): string[] {
  return CATEGORY_RULES
    .filter(r => r.type === 'brand-based')
    .map(r => r.category)
}
