# 🧩 NOTA SERVICE — BLUEPRINT CORE & LOGIC

**Version:** v2.7.2  
**Date:** 5 Januari 2026  
**Status:** 🔒 LOCKED — Phase 1 Complete, Integration Pending

---

## 1. BLUEPRINT FINAL (LOCKED)

### 🔒 PRINSIP BESAR (TIDAK BOLEH DIBANTAH)

1. ✅ **Nota Service = satu entitas induk**
2. ✅ **Dialog = Entry device rusak (bukan kerja)**
3. ✅ **Harga di dialog = ESTIMASI**
4. ✅ **Harga FINAL hanya muncul di List / Detail Final**
5. ✅ **Workflow ≠ Result**
6. ✅ **Sub-Order opsional & toggle**

**⚠️ Kalau ada 1 poin dilanggar → sistem rusak.**

---

### STRUKTUR HIERARKI

```
Nota (Group)
├── Nota Service       (Standalone Page, BUKAN tab)
├── Nota Pesanan       (Sub-Order, opsional)
└── History Pelanggan  (Customer history)
```

---

### DATA FLOW (LOCKED)

```
Dialog (Entry) → DRAFT
    ↓
Detail Page → Estimasi (volatile, editable)
    ↓
Final Result + Root Cause
    ↓
FINALIZED (guard rule passed)
    ↓
Harga Final (locked) → POS + Laporan + History
```

---

### WORKFLOW STATE (AUTO-TRANSITION)

```
DRAFT → IN_PROGRESS → WAITING_PART → FINALIZED
```

| Trigger | New State |
|---------|-----------|
| Ada step pengecekan (min 1) | `IN_PROGRESS` |
| Ada sub-order REQUESTED/ORDERED | `WAITING_PART` |
| All sub-orders resolved (ARRIVED/CANCELLED) | Back to `IN_PROGRESS` |
| Final result + root cause filled + user klik Finalize | `FINALIZED` |

**❌ State TIDAK bisa dipilih manual**  
**✅ State follows data (auto-transition)**

---

### SERVICE RESULT (Manual Input, Saat Finalize)

```typescript
type FinalResult = 
  | 'SUCCESS'     // Service berhasil, device fixed
  | 'FAILED'      // Tidak bisa diperbaiki
  | 'CANCELLED'   // Dibatalkan customer
  | 'PARTIAL'     // Sebagian berhasil
  | 'CLAIM';      // Klaim garansi
```

**📌 FAILED boleh lanjut finalize**

---

### GUARD RULE FINALIZE (CRITICAL)

```typescript
const canFinalize = 
  !!service_result &&
  !!root_cause?.kategori &&
  !!root_cause?.deskripsi &&
  root_cause.deskripsi.length >= 10 &&
  !sub_orders.some(o => ['REQUESTED', 'ORDERED'].includes(o.status));
```

**Requirements:**
- ✅ Service Result dipilih
- ✅ Root Cause kategori terisi
- ✅ Root Cause deskripsi terisi (min 10 char)
- ✅ Tidak ada sub-order aktif (REQUESTED/ORDERED)

---

### ESTIMASI VS HARGA FINAL (LOCK RULE)

#### **Estimasi (Volatile, Non-Binding):**
- ❌ Tidak mengikat
- ✅ Editable (bisa berubah)
- ❌ Tidak dipakai POS
- ❌ Tidak masuk laporan keuangan
- ✅ Hanya referensi customer & teknisi

#### **Harga Final (Locked, Binding):**
| Aspek | Rule |
|-------|------|
| **Lokasi** | ✅ List Nota / Final Summary (BUKAN di dialog/estimasi) |
| **Timing** | Saat `Workflow State = FINALIZED` |
| **Action** | Harga dikunci, masuk POS, masuk laporan, masuk history |

---

### KALAU LANGGAR BLUEPRINT, APA YANG TERJADI

| Pelanggaran | Dampak |
|-------------|--------|
| Harga estimasi ikut masuk laporan | ❌ Laporan keuangan salah |
| Gagal service tapi dianggap belum selesai | ❌ Status ambigu |
| History pelanggan ambigu | ❌ Customer confused |
| POS bocor sebelum FINALIZED | ❌ Billing prematur |
| Workflow manual | ❌ Human error |
| Estimasi = Final | ❌ Customer complaint |

---

## 2. DATA FLOW & AUTO-TRANSITION (IMPLEMENTATION LOGIC)

### State Machine (Implementation)

```typescript
// Initial state
currentState = 'DRAFT'

// Auto-transition useEffect
useEffect(() => {
  if (isFinalized) return; // Don't change if finalized

  let newState: ServiceState = 'DRAFT';

  // Rule 1: Ada step pengecekan → IN_PROGRESS
  if (diagnosisData.hasil_pengecekan.length > 0) {
    newState = 'IN_PROGRESS';
  }

  // Rule 2: Ada sub-order REQUESTED/ORDERED → WAITING_PART
  const hasActiveSub = subOrders.some(
    (sub) => sub.status === 'REQUESTED' || sub.status === 'ORDERED'
  );
  if (hasActiveSub) {
    newState = 'WAITING_PART';
  }

  // Rule 3: Final result filled → ready to FINALIZE (manual trigger)
  // State tetap IN_PROGRESS atau WAITING_PART sampai user klik Finalize

  if (newState !== currentState) {
    setCurrentState(newState);
    // Emit update to parent
    if (onUpdate && nota) {
      onUpdate(nota.id, { service_state: newState });
    }
  }
}, [diagnosisData.hasil_pengecekan, subOrders, isFinalized]);
```

### Guard Rule (Implementation)

```typescript
const canFinalize = 
  !!finalData.service_result &&
  !!finalData.root_cause?.kategori &&
  !!finalData.root_cause?.deskripsi &&
  finalData.root_cause.deskripsi.length >= 10 &&
  !subOrders.some((o) => ['REQUESTED', 'ORDERED'].includes(o.status));
```

### Finalize Handler (Implementation)

```typescript
const handleFinalize = () => {
  if (!canFinalize) {
    toast.error('Lengkapi Final Result & Root Cause terlebih dahulu');
    return;
  }

  // Confirm dialog
  const confirmed = window.confirm(
    'Finalisasi nota service?\n\n' +
    '⚠️ Setelah di-FINALIZED:\n' +
    '- Semua data akan READ-ONLY\n' +
    '- Tidak bisa diedit ulang\n' +
    '- Harga final akan dikunci\n\n' +
    'Lanjutkan?'
  );

  if (!confirmed) return;

  // Emit FINALIZE event
  if (onFinalize && nota) {
    onFinalize(nota.id, {
      service_result: finalData.service_result,
      root_cause: finalData.root_cause,
      // TODO: Calculate harga_final from estimasi + adjustments
    });
  }

  setIsFinalized(true);
  setCurrentState('FINALIZED');
  toast.success('✅ Nota service telah di-FINALIZED');
};
```

---

## 3. KEY PRINCIPLES (LOCKED)

### 1. Estimasi ≠ Final
- **Estimasi:** Editable, Volatile, Informasional, Tidak mengikat, Tidak masuk POS/Laporan
- **Harga Final:** Locked, Immutable, Binding, Masuk POS/Laporan, Hanya saat FINALIZED

### 2. Workflow (Auto) ≠ Result (Manual)
- **Workflow State:** Auto-transition, Based on progress, Read-only display
- **Service Result:** Manual input (saat final), Based on outcome, Required untuk FINALIZED

### 3. Entry (Dialog) ≠ Kerja (Detail)
- **Dialog:** Quick, Info dasar, Device info, Keluhan, Status: DRAFT
- **Detail Page:** Comprehensive, Diagnosis, Action log, Sparepart, Estimasi, Final result

### 4. Toggle = Optional, Not Default
- **Sparepart & Sub-Order:** Default: OFF (collapsed), User toggle ON jika perlu, Reduce cognitive load

### 5. Guard Rules = Data Integrity
- **FINALIZED Guard:** Service result filled, Root cause filled, No active sub-orders
- **Benefit:** Prevent incomplete data, Ensure quality, Audit trail

---

## 4. SUCCESS CRITERIA

**Blueprint ini sudah paling aman untuk:**
1. ✅ **Service HP real** - Workflow natural, step-by-step
2. ✅ **Banyak skenario gagal** - FAILED ada di Result, bukan Workflow
3. ✅ **Banyak revisi harga** - Estimasi editable, Final locked
4. ✅ **Data integrity** - Guard rules prevent errors
5. ✅ **Customer confidence** - Clear separation Estimasi vs Final
6. ✅ **Technician-friendly** - Not overwhelming, progressive disclosure
7. ✅ **Audit trail** - All actions logged, immutable after FINALIZED
8. ✅ **Scalable** - Easy to add features, modular architecture

---

## 5. REFERENCE (TYPES)

```typescript
// Service State (Auto-transition)
type ServiceState = 
  | 'DRAFT'        // Initial state
  | 'IN_PROGRESS'  // Working on it
  | 'WAITING_PART' // Waiting for sparepart
  | 'FINALIZED';   // Done (locked)

// Final Result (Manual input)
type FinalResult = 
  | 'SUCCESS'      // Fixed
  | 'FAILED'       // Cannot fix
  | 'CANCELLED'    // Customer cancelled
  | 'PARTIAL'      // Partially fixed
  | 'CLAIM';       // Warranty claim

// Root Cause
interface RootCause {
  kategori: 'hardware' | 'software' | 'user' | 'unknown';
  deskripsi: string; // Min 10 chars
  catatan?: string;  // Optional
}

// Sub-Order
interface SubOrder {
  id: string;
  sparepart_name: string;
  qty: number;
  supplier?: string;
  estimasi_harga?: number;
  status: SubOrderState;
  created_at: Date;
  updated_at?: Date;
  alasan_cancel?: string;
}

type SubOrderState = 
  | 'REQUESTED'  // Just requested
  | 'ORDERED'    // Order placed
  | 'ARRIVED'    // Received
  | 'CANCELLED'; // Cancelled

// Action Log
interface ActionLog {
  id: string;
  deskripsi: string;
  waktu: Date;
  teknisi?: string;
  hasil?: string;
}
```

---

## 6. LEDGER ARCHITECTURE (AUDITED)

**Status:** ✅ **PRODUCTION READY (Audited 8 Jan 2026)**
**Audit Result:** 5/5 PASS

### Core Architecture (`useNotaStore`)

Implementasi **useNotaStore** 100% selaras dengan pola Ledger (Event Sourcing) yang digunakan di POS dan Transaksi.

#### 1. No Direct Mutation (Mutation via Events Only)
State tidak pernah diubah langsung (`nota.status = '...'`). Semua perubahan melalui event:
- `createNota` → `NOTA_CREATED`
- `updateNota` → `NOTA_UPDATED`
- `finalizeNota` → `NOTA_FINALIZED`
- `deleteNota` → `NOTA_DELETED` (Logical Delete)

#### 2. Finalized = Hard Guard
Function mutation memiliki hard guard internal, bukan hanya di UI.
```typescript
if (existing.service_state === 'FINALIZED') {
  toast.warning('Nota sudah FINALIZED, tidak dapat diubah');
  return; // Stop execution
}
```

#### 3. Logical Delete
Nota yang dihapus tidak hilang dari ledger, hanya ditandai `service_state: 'DELETED'` dan difilter dari view aktif. Ini memungkinkan recovery/audit.

#### 4. Deterministic Replay
State saat ini adalah hasil rekonstruksi ulang dari array ledger (events). Urutan event yang sama akan selalu menghasilkan state akhir yang sama.
