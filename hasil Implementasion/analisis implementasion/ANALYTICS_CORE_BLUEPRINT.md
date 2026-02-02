# 📊 ANALYTICS CORE BLUEPRINT

**Status:** ✅ PRODUCTION READY  
**Version:** 1.0 (Consolidated)  
**Date:** 31 Januari 2026

---

## 1. CORE PHILOSOPHY

1.  **Local-First Analysis:** Semua analisis berjalan di client-side (browser) menggunakan data dari LocalStorage (`transaction` & `stock_ledger`). Tidak ada data sensitif yang dikirim ke server eksternal untuk diproses.
2.  **Snapshot-Based:** Laporan keuangan dan penjualan **WAJIB** menggunakan data snapshot dari transaksi (harga saat transaksi terjadi), bukan harga master product saat ini.
3.  **Privacy-First:** Fitur "AI Insights" atau "Smart Insights" adalah algoritma heuristik lokal. Tidak ada PII (Personally Identifiable Information) customer yang dikirim ke LLM eksternal.
4.  **No Mutation:** Modul Analytics adalah **READ-ONLY**. Ia tidak boleh mengubah data transaksi, stok, atau master data.

---

## 2. ARCHITECTURE

### Directory Structure (`/components/AN/`)
*   `index.tsx`: Main Router (Tabs: Finance, Sales, Inventory, Repair).
*   `FinAnaly.tsx`: Finance Dashboard.
*   `SalesAnaly/`: Sales Analytics Module.
*   `InvAnaly/`: Inventory Analytics Module.
*   `RepairAnaly/`: Repair Performance & Insights.

### Data Sources
*   **Transactions:** Sumber utama untuk Sales & Finance. (`useLS` hook).
*   **Stock Ledger:** Sumber utama untuk Inventory & Stock Movement. (`useStockLedger` hook).
*   **Service History:** Sumber utama untuk Repair Analysis. (`nota_service` collection).

### Naming Convention
Short names digunakan untuk file components:
*   `FinAnaly.tsx` (Finance Analytics)
*   `SumCards.tsx` (Summary Cards)
*   `TopProds.tsx` (Top Products)
*   `CustRFM.tsx` (Customer Recency-Frequency-Monetary)

---

## 3. INTEGRATION

### Routing
Diimport secara lazy di `App.tsx`:
```typescript
const AN = lazy(() => import('./components/AN').then(m => ({ default: m.AN })))
```

### Sidebar
Menu "Analitik" memiliki sub-menu:
*   Keuangan
*   Penjualan
*   Inventory
*   Repair & AI

---

## 4. UI COMPONENTS
*   **Charts:** Recharts (Line, Bar, Pie).
*   **UI:** Shadcn/UI (Cards, Tabs, Tables).
*   **Icons:** Lucide-react.
*   **Grid:** Responsive layout (Mobile-first).
