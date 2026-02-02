# 📈 ANALYTICS FEATURES GUIDE

**Status:** ✅ PRODUCTION READY  
**Version:** 1.0 (Consolidated)  
**Date:** 31 Januari 2026

---

## 1. FINANCE ANALYTICS (`FinAnaly.tsx`)

**Fokus:** Kesehatan finansial bisnis.

### Fitur Utama:
*   **Overview:** Revenue, Expense (HPP), Gross Profit, Net Profit, Margin %.
*   **Cashflow:** Breakdown arus kas masuk (Penjualan, Service) dan keluar (Belanja Stok, Operasional).
*   **Product Profitability:** Analisis produk mana yang memberikan margin keuntungan tertinggi vs volume penjualan.
*   **Price Tracking:** (Snapshot based) Tracking perubahan harga jual rata-rata dari waktu ke waktu.

---

## 2. SALES ANALYTICS (`SalesAnaly/`)

**Fokus:** Performa penjualan dan perilaku pelanggan.

### Fitur Utama:
*   **Summary Cards:** Key metrics (Total Omset, Total Transaksi, AOV - Average Order Value).
*   **Time Series Chart:** Grafik penjualan Harian, Mingguan, Bulanan.
*   **Top Products:** Peringkat produk terlaris berdasarkan Qty dan Revenue.
*   **Time Pattern:** Heatmap waktu keramaian toko (Jam & Hari).
*   **Customer RFM:** Segmentasi pelanggan:
    *   **Recency:** Kapan terakhir belanja?
    *   **Frequency:** Seberapa sering belanja?
    *   **Monetary:** Berapa banyak uang yang dihabiskan?

---

## 3. INVENTORY ANALYTICS (`InvAnaly/`)

**Fokus:** Efisiensi dan kesehatan stok.

### Fitur Utama:
*   **Valuation:** Total nilai aset stok (berdasarkan harga modal).
*   **Stock Movement:** Log pergerakan stok (In/Out) visual.
*   **Dead Stock Detector:** Mendeteksi barang yang tidak bergerak dalam periode tertentu (misal: > 90 hari).
*   **Slow Movers:** Barang dengan turnover rendah.
*   **Brand Performance:** Analisis stok berdasarkan Brand (Samsung, Xiaomi, dll) dan kategori.

---

## 4. REPAIR & AI ANALYTICS (`RepairAnaly/`)

**Fokus:** Kinerja divisi servis dan wawasan cerdas.

### Fitur Utama:
*   **Repair Performance:**
    *   Total Service Masuk vs Selesai.
    *   Success Rate %.
    *   Average Repair Time (Durasi pengerjaan).
*   **Sparepart Quality:** Tracking kualitas sparepart berdasarkan tingkat retur/komplain setelah service.
*   **Vendor Quality:** Penilaian vendor berdasarkan kualitas barang yang disuplai.
*   **AI Diagnosis (Heuristic):**
    *   Prediksi kerusakan berdasarkan gejala (input manual/pola).
    *   Mapping: Model HP + Gejala = Kemungkinan Sparepart Rusak.
    *   Contoh: "Infinix Hot 10" + "Mic Mati" = "Mic Upper Board (Probabilitas 78%)".
*   **Business Insights:** Rekomendasi otomatis (misal: "Stok LCD Oppo A5s menipis tapi permintaan tinggi").
