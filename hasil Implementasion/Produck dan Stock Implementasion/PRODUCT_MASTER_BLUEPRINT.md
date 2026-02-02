# 📦 PRODUCT MASTER & COMPATIBILITY BLUEPRINT

**Status:** ✅ PRODUCTION READY  
**Version:** 2.0 (Consolidated)  
**Date:** 31 Januari 2026

---

## 1. BRAND HP (BLUEPRINT MODE B)

**Prinsip Utama:** Master Brand HP adalah **MASTER PASIF**. Ia tidak memiliki logic bisnis yang kompleks, tidak terhubung ke Ledger, dan berfungsi sebagai fondasi relasi.

### 🔒 Rules (Strict):
1.  **Pasif & Referensial:** Brand HP hanya data referensi. Tidak boleh punya business logic.
2.  **No Ledger:** Perubahan Brand HP **TIDAK** dicatat di Stock Ledger.
3.  **Soft-Delete Only:** Brand yang sudah digunakan (di Produk/Nota/Device Model) **TIDAK BOLEH DIHAPUS**. Gunakan `is_active = false`.
4.  **Unique Name:** Nama brand harus unik (case-insensitive). Slug auto-generated.

### Type Definition (`/types/inventory.ts`)
```typescript
export interface PhoneBrand {
  id: string
  name: string            // Samsung, Xiaomi
  slug: string            // samsung, xiaomi (auto)
  is_active: boolean      // Soft-delete flag
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

---

## 2. AI COMPATIBILITY (EVENT-BASED)

**Prinsip Utama:** Kompatibilitas sparepart adalah **DERIVED DATA** (data turunan) yang tumbuh secara organik dari riwayat pemakaian di Nota Service. **BUKAN input manual**.

### 🔒 Rules (Strict):
1.  **No Manual Input:** User tidak boleh menginput kompatibilitas secara manual di form produk.
2.  **Derived from Usage:** Data kompatibilitas muncul otomatis saat Nota Service statusnya menjadi **"Diambil"**.
3.  **Read-Only Display:** Di form produk, data ini hanya ditampilkan sebagai informasi (hint), tidak bisa diedit.
4.  **Confidence Score:** Dihitung berdasarkan frekuensi pemakaian (`usage_count`).

### Alur Data:
1.  **Nota Service "Diambil"** → System trigger event record usage.
2.  **Record Usage:** `(ProductID, BrandHP, ModelHP)`.
3.  **Product Edit Form:** System menghitung confidence score dan menampilkannya:
    *   *"Samsung A12 — 87% (dipakai 14x)"*

### Type Definition (`/types/inventory.ts`)
```typescript
export interface CompatibilityHint {
  brand: string          // Brand HP
  model: string          // Model HP
  confidence: number     // 0-100%
  usage_count: number
  last_used_at: Date
  source: 'service-history'
}
```

---

## 3. PRODUCT MANAGEMENT ARCHITECTURE

**Struktur Folder:**
*   `/components/PM/` (Product Management)
    *   `Prod/`: Produk Sparepart
    *   `Cat/`: Kategori
    *   `BSP/`: Brand Sparepart
    *   `Stock/`: Kelola Stok (UI Page)
*   `/components/Master/` (Master HP)
    *   `BHP/`: Brand HP
    *   `DM/`: Device Model

### Updated Product Interface (`/types/inventory.ts`)
```typescript
export interface Product {
  // Core
  id: string
  name: string
  sku: string
  category_id: string
  
  // Pricing & Stock
  purchase_price: number    // Modal
  selling_price: number     // Jual
  stock_qty: number         // Tersedia (Managed by Ledger)
  min_stock_alert: number
  
  // Compatibility (AI Derived / Legacy)
  compatibility_hint?: CompatibilityHint[] // AI Derived (Read Only)
  
  // Legacy / Manual Flags
  is_universal?: boolean
  compatible_brands?: string[] // Legacy
  compatible_models?: string[] // Legacy
  
  notes?: string
}
```

### Backward Compatibility
*   Field lama (`price`, `cost`, `stock`) masih didukung via fallback di UI, tapi logic utama menggunakan field baru.
*   Data kompatibilitas lama (manual input) tetap ditampilkan tapi deprecated (tidak bisa tambah baru secara manual).
