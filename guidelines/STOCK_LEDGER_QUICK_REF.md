# 🔷 STOCK LEDGER - QUICK REFERENCE

> **Cheat sheet** untuk sistem Stock Ledger. Simpan ini untuk referensi cepat.

---

## 📦 TYPE ENUM

```typescript
// Stock Ledger Type
type StockLedgerType = 
  | 'IN'       // Stok masuk (pembelian, restok)
  | 'OUT'      // Stok keluar (penjualan, service selesai)
  | 'ADJUST'   // Penyesuaian manual
  | 'RESERVE'  // Di-booking nota service (stok tidak berkurang, tapi available berkurang)
  | 'RELEASE'  // Batal booking (stok kembali available)

// Stock Reference Type
type StockRefType = 
  | 'service'     // Dari nota service
  | 'sale'        // Dari transaksi penjualan
  | 'adjustment'  // Manual adjustment
  | 'purchase'    // Pembelian/restok
  | 'correction'  // Koreksi
  | 'return'      // Return barang
```

---

## 🎯 FUNGSI UTAMA useStockLedger

```typescript
const stockLedger = useStockLedger(products, onProductUpdate)

// 1. Get Status
const status = stockLedger.getStockStatus(productId)
// Returns: { available, reserved, total, min_alert, status }

// 2. Stock IN (Pembelian/Restok)
stockLedger.recordStockIn(
  productId: string,
  qty: number,
  refType: 'purchase' | 'return' | ...,
  refId?: string,
  note?: string
)
// Efek: stock_qty bertambah

// 3. Stock OUT (Penjualan/Service)
stockLedger.recordStockOut(
  productId: string,
  qty: number,
  refType: 'sale' | 'service' | ...,
  refId?: string,
  note?: string
)
// Efek: stock_qty berkurang
// Validasi: qty tidak boleh > available

// 4. RESERVE (Nota Service Proses)
stockLedger.recordStockReserve(
  productId: string,
  qty: number,
  refId: string, // nota.id
  note?: string
)
// Efek: available berkurang, reserved bertambah
// stock_qty TIDAK berubah

// 5. RELEASE (Batal/Tidak Jadi)
stockLedger.recordStockRelease(
  productId: string,
  qty: number,
  refId: string, // nota.id
  note?: string
)
// Efek: available bertambah, reserved berkurang
// stock_qty TIDAK berubah

// 6. Manual Adjustment (DANGEROUS)
stockLedger.recordAdjustment(
  productId: string,
  qtyAfter: number,      // Stok setelah adjustment
  reason: 'physical_count' | 'damaged' | ...,
  reasonNote: string     // WAJIB min 10 karakter
)
// Efek: stock_qty = qtyAfter
// Ledger: type = ADJUST

// 7. Query Helpers
const ledgers = stockLedger.getLedgersByProduct(productId)
const ledgers = stockLedger.getLedgersByRef('service', notaId)
const reservedQty = stockLedger.getReservedQty(productId)
```

---

## 🔄 FLOW CHEAT SHEET

### Nota Service

| Status Change | Aksi Stok | Fungsi |
|--------------|-----------|--------|
| Draft → Proses | RESERVE | `recordStockReserve()` |
| Proses → Selesai (dipakai) | OUT + RELEASE | `recordStockOut()` + `recordStockRelease()` |
| Proses → Selesai (tidak jadi) | RELEASE | `recordStockRelease()` |
| Any → Batal | RELEASE | `recordStockRelease()` |
| Edit Item (Proses) | RELEASE old + RESERVE new | `recordStockRelease()` + `recordStockReserve()` |

### Transaksi Penjualan

```typescript
// Langsung OUT
stockLedger.recordStockOut(productId, qty, 'sale', transactionId)
```

### Pembelian/Restok

```typescript
stockLedger.recordStockIn(productId, qty, 'purchase', undefined, 'Pembelian dari Supplier X')
```

---

## 📊 STOCK STATUS

```typescript
interface StockStatus {
  available: number  // Stok yang bisa digunakan (total - reserved)
  reserved: number   // Stok yang di-booking nota service
  total: number      // Total stok (product.stock_qty)
  min_alert: number  // Minimum stok alert
  status: 'safe' | 'low' | 'out'
}
```

**Logic:**
- `available = total - reserved`
- `reserved = SUM(RESERVE) - SUM(RELEASE)`
- `status = 'out'` jika `total === 0`
- `status = 'low'` jika `total <= min_alert`
- `status = 'safe'` lainnya

---

## ⚠️ VALIDASI PENTING

```typescript
// 1. Cek stok tersedia sebelum OUT atau RESERVE
const status = stockLedger.getStockStatus(productId)
if (status.available < qty) {
  throw new Error('Stok tersedia tidak cukup')
}

// 2. Alasan adjustment wajib >= 10 karakter
if (!reasonNote || reasonNote.length < 10) {
  throw new Error('Alasan harus minimal 10 karakter')
}

// 3. Qty harus positif (kecuali ledger internal)
if (qty <= 0) {
  throw new Error('Jumlah harus lebih dari 0')
}
```

---

## 🧮 CONTOH PERHITUNGAN

```typescript
// Kondisi awal
product.stock_qty = 10
available = 10
reserved = 0

// Event 1: RESERVE 3 unit (nota service)
stockLedger.recordStockReserve('prod_1', 3, 'nota_1')
// Result:
// stock_qty = 10 (tidak berubah)
// available = 7
// reserved = 3

// Event 2: OUT 2 unit (penjualan langsung)
stockLedger.recordStockOut('prod_1', 2, 'sale', 'tx_1')
// Result:
// stock_qty = 8
// available = 5 (8 - 3)
// reserved = 3

// Event 3: RELEASE 3 unit (nota batal)
stockLedger.recordStockRelease('prod_1', 3, 'nota_1')
// Result:
// stock_qty = 8 (tidak berubah)
// available = 8
// reserved = 0
```

---

## 🎨 UI COMPONENT

```typescript
// Tampilkan status stok di UI
<div>
  <div>Total: {status.total}</div>
  <div className="text-green-600">Tersedia: {status.available}</div>
  <div className="text-blue-600">Ter-reserve: {status.reserved}</div>
  <Badge variant={
    status.status === 'out' ? 'destructive' :
    status.status === 'low' ? 'warning' :
    'success'
  }>
    {status.status === 'out' ? 'Habis' :
     status.status === 'low' ? 'Menipis' :
     'Aman'}
  </Badge>
</div>

// Button kelola stok
<Button onClick={() => setSelectedProduct(product)}>
  <Settings className="w-4 h-4 mr-2" />
  Kelola Stok
</Button>

// StockDialog component
<StockDialog
  open={!!selectedProduct}
  onOpenChange={(open) => !open && setSelectedProduct(null)}
  product={selectedProduct}
  stockStatus={stockLedger.getStockStatus(selectedProduct.id)}
  ledgers={stockLedger.getLedgersByProduct(selectedProduct.id)}
  onStockIn={(qty, note) => stockLedger.recordStockIn(...)}
  onStockOut={(qty, note) => stockLedger.recordStockOut(...)}
  onAdjustment={(qtyAfter, reason, note) => stockLedger.recordAdjustment(...)}
/>
```

---

## 🚨 ERROR HANDLING

```typescript
try {
  stockLedger.recordStockOut(productId, qty, 'sale', txId)
  toast.success('Stok berhasil dikurangi')
} catch (error) {
  if (error.message.includes('tidak cukup')) {
    toast.error('Stok tidak cukup!')
    // Handle: Tampilkan dialog "Stok habis, lanjutkan?"
  } else {
    toast.error('Gagal mengurangi stok')
  }
}
```

---

## 🔗 FILES TERKAIT

- **Types:** `/types/inventory.ts`
- **Hook:** `/hooks/useStockLedger.ts`
- **Dialog:** `/components/PM/Stock/StockDialog.tsx`
- **Page:** `/components/PM/Stock/Stock.tsx`
- **Integration Guide:** `/guidelines/STOCK_LEDGER_NOTA_INTEGRATION.md`

---

**Simpan guide ini untuk referensi cepat!**
