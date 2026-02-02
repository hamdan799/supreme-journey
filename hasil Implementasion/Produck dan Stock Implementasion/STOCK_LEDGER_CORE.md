# 📊 STOCK LEDGER CORE SYSTEM

**Status:** ✅ PRODUCTION READY  
**Version:** 1.0 (Consolidated)  
**Date:** 31 Januari 2026

---

## 1. CORE PRINCIPLES (HUKUM STOK)

1.  **Stok tidak boleh berubah tanpa sebab (Event).**
2.  **`stock_qty` di Product adalah hasil akhir kalkulasi, bukan field yang diedit langsung.**
3.  **Nota Service & Transaksi TIDAK langsung mengubah stok**, tapi memicu Event Ledger.
4.  **Manual Edit = Privilege Khusus** (Adjustment) dan wajib ada alasan.

---

## 2. ARCHITECTURE & TYPES

### Stock Ledger Type (`/types/inventory.ts`)
```typescript
export type StockLedgerType = 'IN' | 'OUT' | 'ADJUST' | 'RESERVE' | 'RELEASE'
export type StockRefType = 'service' | 'sale' | 'adjustment' | 'purchase'

export interface StockLedger {
  id: string
  product_id: string
  qty_change: number        // Positif (+) atau Negatif (-)
  type: StockLedgerType
  ref_type: StockRefType
  ref_id?: string          // ID Nota / Transaksi
  note?: string
  created_at: Date
}
```

### Stock Status Calculation
*   **Available:** `stock_qty - reserved`
*   **Reserved:** Total qty yang sedang di-booking oleh Nota Service aktif (belum diambil).
*   **Total:** `stock_qty` (Fisik di toko).

---

## 3. FLOW PERUBAHAN STOK

### A. Nota Service Flow (Reserve Pattern)
1.  **Draft → Proses:** Trigger **RESERVE**.
    *   `Available` berkurang. `Reserved` bertambah. `Total` TETAP.
2.  **Proses → Selesai (Dipakai):** Trigger **OUT** + **RELEASE**.
    *   `Total` berkurang. `Reserved` berkurang.
3.  **Proses → Batal / Selesai (Tidak Jadi):** Trigger **RELEASE**.
    *   `Available` bertambah (kembali). `Reserved` berkurang.

### B. POS Transaction Flow (Direct Out)
1.  **Transaksi Bayar:** Trigger **OUT**.
    *   `Total` berkurang. `Available` berkurang.

### C. Adjustment (Manual)
1.  **Stock Opname / Koreksi:** Trigger **ADJUST**.
    *   Wajib menyertakan alasan (min 10 karakter).
    *   Mengubah `Total` dan `Available`.

---

## 4. USESTOCKLEDGER HOOK

Hook `useStockLedger` adalah gatekeeper tunggal untuk semua perubahan stok.

```typescript
const stockLedger = useStockLedger(products, onProductUpdate)

// API
stockLedger.recordStockIn(...)
stockLedger.recordStockOut(...)
stockLedger.recordStockReserve(...) // Penting untuk Nota
stockLedger.recordStockRelease(...) // Penting untuk Nota
stockLedger.recordAdjustment(...)
```

---

## 5. HAK AKSES (ROLE BASED)

*   **View Stock:** Semua Role.
*   **OUT (Transaksi):** Kasir, Owner.
*   **RESERVE (Nota):** Teknisi, Owner.
*   **ADJUST (Manual):** Owner, Admin (Strict).
