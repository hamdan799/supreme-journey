# 🚧 ANALYTICS REMAINING TASKS

**Version:** 1.0 (Consolidated)  
**Date:** 31 Januari 2026

---

## 1. INTEGRATION TASKS

*   [ ] **Real Data Connection:**
    *   Hubungkan mock data saat ini dengan `useLS` (Transactions) dan `useStockLedger` (Inventory).
    *   Pastikan kalkulasi berjalan realtime di client-side.
*   [ ] **Pagination & Performance:**
    *   Optimasi rendering chart untuk dataset besar (> 1000 transaksi).
    *   Implementasi `useMemo` untuk kalkulasi berat.

## 2. REPORTING & EXPORT

*   [ ] **Export Engine:**
    *   Implementasi fungsi download PDF/Excel untuk setiap laporan tab.
    *   Pastikan format laporan rapi dan siap cetak.
*   [ ] **Custom Date Range:**
    *   Sempurnakan date picker untuk filter periode custom yang lebih fleksibel.

## 3. AI & INSIGHTS ENHANCEMENT

*   [ ] **Dynamic Heuristics:**
    *   Buat algoritma "Smart Insight" benar-benar belajar dari pola data lokal (bukan hardcoded rules).
    *   Contoh: Jika stok X habis 3x dalam sebulan, munculkan alert "High Demand Item".
*   [ ] **Forecast Engine:**
    *   Implementasi simple moving average (SMA) untuk prediksi kebutuhan stok sparepart bulan depan.

## 4. UI POLISHING

*   [ ] **Mobile Responsiveness:**
    *   Pastikan semua chart bisa discroll atau resize dengan baik di layar HP.
*   [ ] **Dark Mode Support:**
    *   Pastikan warna chart kontras di mode gelap (jika aplikasi support dark mode).
