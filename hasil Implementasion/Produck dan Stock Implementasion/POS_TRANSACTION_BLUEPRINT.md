# 💰 POS & TRANSACTION BLUEPRINT

**Status:** ✅ PRODUCTION READY  
**Version:** 2.5 (Consolidated)  
**Date:** 31 Januari 2026

---

## 1. POS ARCHITECTURE (EVENT-DRIVEN)

**Prinsip Fundamental:** POS adalah **Event Generator Utama**. Ia adalah satu-satunya pintu masuk perubahan stok dan keuangan dari penjualan.

### Struktur Folder (`/components/TX/pos/`)
*   `POS.tsx`: UI Orchestrator (View).
*   `pos.service.ts`: Business Logic & Validation (Otak).
*   `pos.utils.ts`: Pure Functions (Helper).
*   `pos.types.ts`: Type Contracts (Kontrak).

### Critical Workflow: `submitPOS()`
1.  **Validate:** Cek stok, cek pembayaran.
2.  **Freeze Snapshot:** Simpan harga modal (`cost`) dan jual (`price`) saat ini. **JANGAN** refer ke master product harga live.
3.  **Build Transaction:** Buat object transaksi.
4.  **Emit Events:**
    *   `POS_CREATED`: Transaksi berhasil dibuat.
    *   `STOCK_DECREASED`: Kurangi stok (via Ledger).
    *   `PAYMENT_RECORDED`: Catat keuangan.
    *   `DEBT_CREATED`: Jika status Hutang/Sebagian.

---

## 2. PRICE SNAPSHOT (HUKUM MATI)

**Aturan:** Setiap item dalam transaksi **WAJIB** menyimpan snapshot:
*   `unitPrice`: Harga jual saat transaksi terjadi.
*   `unitCost`: Harga modal saat transaksi terjadi.

**Kenapa?**
Jika harga master berubah besok, laporan laba rugi transaksi hari ini **TIDAK BOLEH BERUBAH**. Query laporan haram mengambil harga dari tabel Product. Harus dari tabel `TransactionItem`.

---

## 3. RIWAYAT TRANSAKSI (READ-ONLY)

**Prinsip:** Riwayat Transaksi adalah **Viewer Immutable Data**.

### Rules:
1.  **No Edit/Update:** Transaksi yang sudah terjadi haram diedit sembarangan.
2.  **Snapshot Display:** Menampilkan data dari snapshot `transaction.items`, bukan join ke master product.
3.  **Pure UI:** Hanya untuk Filter, Search, Sort, dan Print.

### Data Flow:
`useLS` (Load Data) → `History.tsx` (Filter/Sort) → `HistoryList` (Render) → `HistoryItem` (Snapshot Display).

---

## 4. VALIDATION SYSTEM

POS Service (`pos.service.ts`) menangani validasi ketat:
1.  **Stok:** Tidak bisa add to cart jika `qty > available_stock`.
2.  **Pembayaran:**
    *   `Partial`: Amount harus `> 0` dan `< Total`.
    *   `Split`: Total Cash + Transfer harus `>= Total`.
    *   `Debt`: Wajib pilih Kontak (Customer).
