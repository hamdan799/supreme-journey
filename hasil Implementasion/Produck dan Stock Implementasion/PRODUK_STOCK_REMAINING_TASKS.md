# 🚧 REMAINING TASKS: PRODUCT, STOCK & POS

**Version:** 1.0 (Consolidated)  
**Date:** 31 Januari 2026

---

## 1. PRODUCT & MASTER DATA

### 🚀 Next Steps
1.  **Device Model Implementation (Blueprint Mode B):**
    *   Implementasi `DeviceModel` master data.
    *   Relasi dengan `PhoneBrand`.
    *   Form CRUD untuk Device Model.
2.  **Integrasi Nota Service:**
    *   Auto-filter sparepart di Nota Service berdasarkan kompatibilitas AI.
    *   Implementasi "Pola Pemakaian Terdeteksi" di UI Nota saat memilih sparepart.

---

## 2. STOCK LEDGER

### 🚀 Next Steps
1.  **Integrasi Penuh dengan Nota Service (Rombakan Nota):**
    *   Implementasi handler status change di Nota Service:
        *   `Draft` → `Proses`: Trigger **RESERVE**.
        *   `Proses` → `Selesai`: Trigger **OUT** + **RELEASE**.
        *   `Proses` → `Batal`: Trigger **RELEASE**.
    *   **CRITICAL:** Pastikan ini berjalan atomik agar stok tidak bocor.

2.  **Testing Edge Cases:**
    *   Stok habis saat Reserve (Nota Service).
    *   Edit item Nota saat status Proses (Release Old + Reserve New).

---

## 3. POS & TRANSAKSI

### 🚀 Next Steps
1.  **Testing Manual:**
    *   Test flow hutang dan pelunasan.
    *   Test split payment.
    *   Test validasi stok habis.
2.  **Refactor Transaction Dialog:**
    *   Terapkan pattern yang sama (Service/UI separation) ke dialog transaksi manual jika ada.
3.  **Hutang Read-Only View:**
    *   Pastikan view hutang juga mengikuti prinsip Read-Only dan Snapshot.

---

## 4. INTEGRATION CHECKLIST

*   [ ] **Nota Service** menggunakan `useStockLedger` untuk reserve stok.
*   [ ] **POS** menggunakan `useStockLedger` untuk mengurangi stok (OUT).
*   [ ] **Riwayat Transaksi** menampilkan data yang konsisten dengan POS Snapshot.
*   [ ] **Product Form** menampilkan Compatibility Hint dari data Nota Service.
