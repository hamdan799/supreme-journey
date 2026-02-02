# 🔷 PETUNJUK INTEGRASI STOCK LEDGER DENGAN NOTA SERVICE

> **📌 CRITICAL GUIDE** untuk rombakan Nota Service agar tidak konflik dengan sistem Stock Ledger yang baru.

---

## 🎯 PRINSIP UTAMA (WAJIB PAHAM)

1. **Nota Service TIDAK BOLEH edit `product.stock_qty` langsung**
2. **Semua perubahan stok WAJIB melalui `useStockLedger` hook**
3. **Status Nota menentukan aksi stok:**
   - **Draft** → Tidak ada efek stok
   - **Proses** → RESERVE stok
   - **Selesai (dipakai)** → OUT stok + RELEASE reserve
   - **Selesai (tidak dipakai)** → RELEASE reserve saja
   - **Batal** → RELEASE reserve

---

## 📦 STRUKTUR NOTA SERVICE (Sudah Ada)

```typescript
export interface NotaService {
  id: string
  noNota: string
  status: NotaStatus // 'Proses' | 'Selesai' | 'Diambil'
  
  // Sub-pesanan (Sparepart)
  subPesanan?: NotaPesanan[] // Array sparepart yang dibutuhkan
  
  // Metadata
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface NotaPesanan {
  id: string
  produk: string
  qty: number
  product_id?: string // Link ke products collection
  status: PesananStatus // 'Proses' | 'Ada' | 'Selesai'
  // ... fields lainnya
}
```

---

## 🔄 FLOW PERUBAHAN STOK (Event-based)

### 1️⃣ **Nota Baru Dibuat (Status: Draft)**

```typescript
// ❌ JANGAN LAKUKAN APA-APA PADA STOK
// Nota masih draft, belum ada komitmen stok
```

**Aksi:** Tidak ada perubahan stok.

---

### 2️⃣ **Nota Diproses (Status: Proses)**

```typescript
// ✅ RESERVE stok untuk setiap item di subPesanan
nota.subPesanan.forEach(item => {
  if (item.product_id && item.qty > 0) {
    stockLedger.recordStockReserve(
      item.product_id, 
      item.qty, 
      nota.id, // ref_id = nota.id
      `Reserved untuk nota ${nota.noNota}`
    )
  }
})
```

**Efek:**
- `product.stock_qty` → **Tidak berubah**
- `available` → **Berkurang** (karena di-reserve)
- `reserved` → **Bertambah**

**Ledger Entry:**
```
type: RESERVE
ref_type: service
ref_id: nota.id
qty_change: +item.qty
```

---

### 3️⃣ **Edit Nota (Ubah Item Saat Masih Proses)**

```typescript
// ⚠️ HARUS HANDLE RESERVE LAMA DAN BARU

// Step 1: RELEASE item lama
oldItems.forEach(item => {
  if (item.product_id && item.qty > 0) {
    stockLedger.recordStockRelease(
      item.product_id,
      item.qty,
      nota.id,
      `Release karena edit nota ${nota.noNota}`
    )
  }
})

// Step 2: RESERVE item baru
newItems.forEach(item => {
  if (item.product_id && item.qty > 0) {
    stockLedger.recordStockReserve(
      item.product_id,
      item.qty,
      nota.id,
      `Reserve baru setelah edit nota ${nota.noNota}`
    )
  }
})
```

**Edge Case:** Jika qty item berubah (misal: item A dari 2 jadi 3), RELEASE 2, lalu RESERVE 3.

---

### 4️⃣ **Nota Selesai - Item Dipakai (Status: Selesai, Item Status: Selesai)**

```typescript
// ✅ OUT stok (karena dipakai) + RELEASE reserve

nota.subPesanan.forEach(item => {
  if (item.product_id && item.qty > 0 && item.status === 'Selesai') {
    // Step 1: OUT stok
    stockLedger.recordStockOut(
      item.product_id,
      item.qty,
      'service', // ref_type
      nota.id,  // ref_id
      `Dipakai di nota service ${nota.noNota}`
    )
    
    // Step 2: RELEASE reserve
    stockLedger.recordStockRelease(
      item.product_id,
      item.qty,
      nota.id,
      `Release reserve setelah OUT di nota ${nota.noNota}`
    )
  }
})
```

**Efek:**
- `product.stock_qty` → **Berkurang** (karena OUT)
- `available` → **Kembali normal** (RELEASE reserve, tapi stock berkurang)
- `reserved` → **Berkurang**

**Ledger Entry:**
```
1. type: OUT, qty_change: -item.qty
2. type: RELEASE, qty_change: -item.qty
```

---

### 5️⃣ **Nota Selesai - Item Tidak Dipakai (Batal/Tidak Jadi)**

```typescript
// ✅ RELEASE reserve saja (tidak OUT)

nota.subPesanan.forEach(item => {
  if (item.product_id && item.qty > 0 && item.status !== 'Selesai') {
    stockLedger.recordStockRelease(
      item.product_id,
      item.qty,
      nota.id,
      `Item tidak jadi dipakai di nota ${nota.noNota}`
    )
  }
})
```

**Efek:**
- `product.stock_qty` → **Tidak berubah**
- `available` → **Kembali normal**
- `reserved` → **Berkurang**

---

### 6️⃣ **Nota Dibatalkan (Status: Batal)**

```typescript
// ✅ RELEASE semua reserve

nota.subPesanan.forEach(item => {
  if (item.product_id && item.qty > 0) {
    stockLedger.recordStockRelease(
      item.product_id,
      item.qty,
      nota.id,
      `Nota dibatalkan ${nota.noNota}`
    )
  }
})
```

---

## 🧠 STATE MACHINE DIAGRAM

```
┌──────────────┐
│    DRAFT     │  → Tidak ada efek stok
└──────┬───────┘
       │ (User klik "Proses")
       ▼
┌──────────────┐
│   PROSES     │  → RESERVE stok
└──────┬───────┘     (available berkurang, reserved bertambah)
       │
       ├─────────────────────┐
       │ (Item dipakai)      │ (Item tidak jadi)
       ▼                     ▼
┌──────────────┐      ┌──────────────┐
│ OUT + RELEASE│      │   RELEASE    │
│  (dipakai)   │      │ (tidak jadi) │
└──────────────┘      └──────────────┘
       │                     │
       └─────────┬───────────┘
                 ▼
         ┌──────────────┐
         │   SELESAI    │
         └──────────────┘

       ┌─────────────┐
       │    BATAL    │  → RELEASE semua reserve
       └─────────────┘
```

---

## ⚠️ EDGE CASES & SOLUSI

### 🔴 **Stok Habis Tapi Nota Service Harus Jalan**

**Skenario:** User buat nota service, tapi stok sparepart habis.

**Solusi:**

```typescript
// Tandai item sebagai "waiting_stock"
const item: NotaPesanan = {
  ...itemData,
  waiting_stock: true, // Field baru
  status: 'Proses'
}

// JANGAN RESERVE karena stok tidak ada
// UI menampilkan badge "Menunggu Stok"
```

**Flow:**
1. Item tetap ada di nota, tapi tidak di-reserve
2. Saat stok tersedia, user bisa klik "Aktifkan Reserve"
3. Baru lakukan `recordStockReserve()`

---

### 🔴 **User Edit Nota Berkali-kali**

**Masalah:** Reserve-release bisa berantakan.

**Solusi:**
- Setiap edit, **wajib** RELEASE reserve lama dulu
- Lalu RESERVE reserve baru
- Ledger akan mencatat semua event ini (audit trail)

---

### 🔴 **Sparepart Universal (is_universal = true)**

**Tidak masalah.**
- Sistem tetap track per `product_id`
- Ledger tetap mencatat semua pergerakan

---

## 🛠️ IMPLEMENTASI DI NOTA DIALOG

### Import Hook

```typescript
import { useStockLedger } from '../../../hooks/useStockLedger'
```

### Inisialisasi

```typescript
const stockLedger = useStockLedger(products, onProductUpdate)
```

### Handle Status Change

```typescript
function handleStatusChange(nota: NotaService, newStatus: NotaStatus) {
  const oldStatus = nota.status
  
  // Draft → Proses
  if (oldStatus === 'Draft' && newStatus === 'Proses') {
    nota.subPesanan?.forEach(item => {
      if (item.product_id && item.qty > 0) {
        try {
          stockLedger.recordStockReserve(
            item.product_id,
            item.qty,
            nota.id,
            `Reserved untuk nota ${nota.noNota}`
          )
        } catch (error) {
          toast.error(`Gagal reserve ${item.produk}: ${error.message}`)
          // Handle: Bisa marking item sebagai waiting_stock
        }
      }
    })
  }
  
  // Proses → Selesai
  if (oldStatus === 'Proses' && newStatus === 'Selesai') {
    nota.subPesanan?.forEach(item => {
      if (item.product_id && item.qty > 0) {
        if (item.status === 'Selesai') {
          // Item dipakai: OUT + RELEASE
          stockLedger.recordStockOut(item.product_id, item.qty, 'service', nota.id, `Dipakai di ${nota.noNota}`)
          stockLedger.recordStockRelease(item.product_id, item.qty, nota.id, `Release setelah OUT`)
        } else {
          // Item tidak jadi: RELEASE saja
          stockLedger.recordStockRelease(item.product_id, item.qty, nota.id, `Tidak jadi dipakai`)
        }
      }
    })
  }
  
  // Batal
  if (newStatus === 'Batal') {
    nota.subPesanan?.forEach(item => {
      if (item.product_id && item.qty > 0) {
        stockLedger.recordStockRelease(item.product_id, item.qty, nota.id, `Nota dibatalkan`)
      }
    })
  }
  
  // Update nota status
  onNotaUpdate(nota.id, { status: newStatus, updatedAt: new Date().toISOString() })
}
```

---

## ✅ CHECKLIST ROMBAKAN NOTA

Saat rombak bagian Nota, pastikan:

- [ ] Import `useStockLedger` hook
- [ ] Hapus semua `product.stock_qty--` atau `product.stock_qty++` manual
- [ ] Implementasi RESERVE saat status → Proses
- [ ] Implementasi OUT + RELEASE saat selesai (dipakai)
- [ ] Implementasi RELEASE saat selesai (tidak jadi)
- [ ] Implementasi RELEASE saat batal
- [ ] Handle edit nota (release lama, reserve baru)
- [ ] Handle stok habis (waiting_stock flag)
- [ ] Test semua flow status change
- [ ] Verifikasi ledger tercatat dengan benar

---

## 🎓 CONTOH KASUS LENGKAP

**Skenario:** Nota service ganti LCD Samsung A50

```typescript
// 1. User buat nota (Draft)
const nota: NotaService = {
  id: 'nota_001',
  noNota: 'NS-001',
  status: 'Draft', // ← Tidak ada efek stok
  subPesanan: [
    { id: 'item_1', produk: 'LCD A50', product_id: 'prod_lcd_a50', qty: 1, status: 'Proses' }
  ]
}

// 2. User klik "Proses"
handleStatusChange(nota, 'Proses')
// Efek: RESERVE 1 unit LCD A50
// Ledger: { type: RESERVE, qty_change: +1, ref_type: service, ref_id: nota_001 }
// Stock: total=10, available=9, reserved=1

// 3. Teknisi selesai, LCD dipasang
handleStatusChange(nota, 'Selesai')
// Item status = 'Selesai' (dipakai)
// Efek: 
//   - OUT 1 unit (stock_qty: 10 → 9)
//   - RELEASE reserve 1 unit
// Ledger:
//   1. { type: OUT, qty_change: -1, ref_type: service }
//   2. { type: RELEASE, qty_change: -1, ref_type: service }
// Stock: total=9, available=9, reserved=0
```

---

## 🚨 PANTANGAN (JANGAN LAKUKAN INI)

❌ **Edit `product.stock_qty` langsung:**
```typescript
// ❌ JANGAN
product.stock_qty = product.stock_qty - item.qty
```

❌ **OUT tanpa RELEASE:**
```typescript
// ❌ SALAH - Reserve tidak dilepas
stockLedger.recordStockOut(...)
// HARUS:
stockLedger.recordStockOut(...)
stockLedger.recordStockRelease(...)
```

❌ **RESERVE tanpa validasi:**
```typescript
// ❌ BERBAHAYA - Bisa reserve melebihi stok
stockLedger.recordStockReserve(productId, 999, notaId)
// HARUS:
const status = stockLedger.getStockStatus(productId)
if (status.available >= qty) {
  stockLedger.recordStockReserve(productId, qty, notaId)
} else {
  // Handle stok tidak cukup
}
```

---

## 📞 KESIMPULAN

Sistem Stock Ledger ini dirancang agar:
✅ **Audit trail lengkap** - Semua perubahan tercatat
✅ **Reserved stock tracking** - Stok yang di-booking nota service tidak hilang
✅ **Event-based** - Stok berubah karena event, bukan edit manual
✅ **Scalable** - Bisa dikembangkan untuk fitur lanjutan (sub-pesanan, waiting stock, dll)

**Jika ada pertanyaan saat rombak Nota, lihat guide ini lagi.**

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** ${new Date().toISOString().split('T')[0]}
