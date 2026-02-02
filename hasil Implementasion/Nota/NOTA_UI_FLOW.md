# 🧩 NOTA SERVICE — UI FLOW

**Version:** v2.7.2  
**Date:** 5 Januari 2026

---

## 1. UI FLOW END-TO-END

### 🟢 STEP 1: ENTRY → DIALOG "TAMBAH NOTA SERVICE"

**File:** `/components/Nota/NSDlg.tsx` ✅

**Sections (A-E):**
```
A. Info Dasar
   - Nama pelanggan *
   - No HP *
   - Status pelanggan (Baru/Lama)
   - Button: "📞 Pilih dari Kontak"

B. Device
   - Brand HP * (select + add)
   - Model HP * (free text)
   - IMEI (opsional)
   - Sandi unlock (opsional)

C. Aksesoris (Checklist)
   ☐ SIM Card
   ☐ Memory Card
   ☐ Battery
   ☐ Back Casing
   ☐ Case

D. Keluhan Pelanggan
   - Textarea (free text)
   - AI hint: mati total, bootloop, pecah, dll

E. Status Awal (READ-ONLY)
   Workflow State: DRAFT
   ⚠️ Status akan berubah otomatis saat teknisi bekerja
```

**Button:**
```
[ Batal ]  [ Simpan & Buat Nota Service ]
```

**Hasil klik Simpan:**
1. ✅ Status = `DRAFT`
2. ✅ Dialog nutup
3. ✅ Redirect ke LIST PAGE
4. ✅ Row baru muncul di paling atas
5. ✅ Toast: "✅ Nota service berhasil dibuat (Status: DRAFT)"

---

### 📋 STEP 2: LIST PAGE — NOTA SERVICE (HARIAN TEKNISI)

**File:** `/components/Nota/NSPage.tsx` (update pending)

**Tujuan UI:**
- Melihat apa saja device yang harus dikerjakan
- Tanpa mikir state manual
- Tanpa buka detail kalau belum perlu

**Struktur UI:**
```
[ + Tambah Nota Service ]

┌─────────────────────────────────────────────────────────────┐
│ No │ Pelanggan │ Device │ State         │ Estimasi │      │
├─────────────────────────────────────────────────────────────┤
│ 01 │ Andi      │ Redmi  │ Draft         │ -        │  >   │
│ 02 │ Budi      │ Oppo   │ In Progress   │ 350k     │  >   │
│ 03 │ Sari      │ iPhone │ Waiting Part  │ 1.2jt    │  >   │
│ 04 │ Rina      │ Vivo   │ Finalized     │ -        │  >   │
│    │           │        │ (Failed)      │          │      │
└─────────────────────────────────────────────────────────────┘
```

**Elemen Penting:**
- ✅ **State = badge warna (READ ONLY)**
  - DRAFT: Gray
  - IN_PROGRESS: Blue
  - WAITING_PART: Amber
  - FINALIZED: Green
- ✅ **Estimasi = opsional, bisa kosong**
- ✅ **Klik row → masuk Detail Page**
- ❌ **Tidak ada toggle state**
- ❌ **Tidak ada edit dari sini**

**Harga Final Display Rule:**
```typescript
// HANYA tampilkan harga final jika FINALIZED
{nota.service_state === 'FINALIZED' && (
  <div className="text-lg font-bold">
    Rp {nota.harga_final?.toLocaleString()}
  </div>
)}

// Jika belum FINALIZED, tampilkan estimasi (opsional)
{nota.service_state !== 'FINALIZED' && nota.estimasi_total && (
  <div className="text-sm text-muted-foreground">
    Est: Rp {nota.estimasi_total.toLocaleString()}
  </div>
)}
```

---

### 🛠️ STEP 3: DETAIL PAGE — NOTA SERVICE (HALAMAN KERJA)

**File:** `/components/Nota/NSDetailPage.tsx` ✅

**Layout:** 1 page penuh, scroll vertikal

---

#### 🔹 SECTION 1 — HEADER (STICKY)

```
┌───────────────────────────────────────────────────────┐
│ ← Kembali                                             │
│                                                       │
│ Nota Service #NS-00123                                │
│ [Draft] [🔒 Read-Only]                                │
│                                                       │
│ Andi — Redmi Note 10 Pro                             │
│ Tanggal masuk: 5 Jan 2026                            │
└───────────────────────────────────────────────────────┘
```

**Features:**
- Badge state auto (color-coded)
- Result badge (jika finalized): SUCCESS / FAILED / etc
- Read-Only badge (jika finalized): 🔒
- Header sticky biar teknisi selalu tau posisi

---

#### 🔹 SECTION 2 — INFO DEVICE (READ ONLY)

```
┌───────────────────────────────────────────────────────┐
│ 📦 Ringkasan Device & Pelanggan                       │
├───────────────────────────────────────────────────────┤
│ Pelanggan    : Andi                                   │
│ No HP        : 08xxxx                                 │
│ Device       : Redmi Note 10 Pro                      │
│ IMEI         : xxxx                                   │
│                                                       │
│ Kelengkapan:                                          │
│ [SIM] [Battery] [Back Case]                          │
│                                                       │
│ Keluhan Awal:                                         │
│ ┌───────────────────────────────────────────────┐    │
│ │ "HP mati total habis dicas"                   │    │
│ └───────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────┘
```

**Karakteristik:**
- ➡️ Tidak bisa diedit
- ➡️ Jadi konteks kerja
- ➡️ Badges untuk kelengkapan

---

#### 🔹 SECTION 3 — WORKFLOW & DIAGNOSIS (KERJA UTAMA)

**Component:** `NSDiag.tsx` ✅

```
┌───────────────────────────────────────────────────────┐
│ 🔧 Diagnosis & Pengecekan                             │
├───────────────────────────────────────────────────────┤
│ Diagnosis Awal                                        │
│ ┌───────────────────────────────────────────────┐    │
│ │ [textarea bebas]                              │    │
│ └───────────────────────────────────────────────┘    │
│                                                       │
│ Hasil Pengecekan *                [+ Tambah Step]     │
│ ┌───────────────────────────────────────────────┐    │
│ │ [1] Cek arus                            [X]   │    │
│ │ [2] Cek IC power                        [X]   │    │
│ └───────────────────────────────────────────────┘    │
│                                                       │
│ ✓ Step pertama ditambahkan → Status auto IN_PROGRESS │
│                                                       │
│ Indikasi Kerusakan                                    │
│ ┌───────────────────────────────────────────────┐    │
│ │ [textarea]                                    │    │
│ └───────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────┘
```

**Auto-Transition:**
```typescript
if (hasil_pengecekan.length > 0) {
  currentState = 'IN_PROGRESS' // Auto!
}
```

**UI Feedback:**
- ✓ Step pertama ditambahkan → Status auto IN_PROGRESS (green text)

---

#### 🔹 SECTION 4 — ACTION LOG (NARASI TEKNISI)

**Component:** `NSActLog.tsx` ✅

```
┌───────────────────────────────────────────────────────┐
│ 📋 Action Log (Jurnal Kerja)                          │
├───────────────────────────────────────────────────────┤
│                                      [+ Tambah Action] │
│                                                       │
│ ┌───────────────────────────────────────────────┐    │
│ │ [🕐 10:15] Angkat IC power            [Trash] │    │
│ │ [🕐 10:40] Ganti IC power             [Trash] │    │
│ └───────────────────────────────────────────────┘    │
│                                                       │
│ Form Tambah:                                          │
│ Deskripsi tindakan: [___________________________]     │
│ Hasil (opsional):   [___________________________]     │
│ Teknisi (opsional): [___________________________]     │
│ [Tambah Action]                                       │
└───────────────────────────────────────────────────────┘
```

**Karakteristik:**
- Ini jurnal kerja
- Bisa panjang
- Tidak mempengaruhi state secara manual
- Auto timestamp
- Scrollable (max-height: 200px)

---

#### 🔹 SECTION 5 — SUB-ORDER & SPAREPART (COLLAPSIBLE)

**Component:** `NSSubOrd.tsx` ✅

**Default (Collapsed):**
```
┌───────────────────────────────────────────────────────┐
│ 📦 Sub-Order & Sparepart (Opsional)      [2 item] ▼  │
└───────────────────────────────────────────────────────┘
```

**Saat Dibuka (Expanded):**
```
┌───────────────────────────────────────────────────────┐
│ 📦 Sub-Order & Sparepart (Opsional)      [2 item] ▲  │
├───────────────────────────────────────────────────────┤
│ ⚠️ PERHATIAN: Nota tidak bisa FINALIZED selama ada   │
│ sub-order aktif (REQUESTED/ORDERED).                 │
│                                                       │
│ Sub-Order                            [+ Tambah]       │
│ ┌───────────────────────────────────────────────┐    │
│ │ IC Power                                      │    │
│ │ Qty: 1 • Supplier: ABC • Est: 120k           │    │
│ │ [Dipesan ▼]                          [Trash]  │    │
│ └───────────────────────────────────────────────┘    │
│                                                       │
│ Ambil dari Katalog (TODO - Phase 2)                  │
│ [Cari Produk]                                         │
└───────────────────────────────────────────────────────┘
```

**Auto-Transition:**
```typescript
// Rule 1: Sub-order created/updated
if (sub_orders.some(o => o.status === 'REQUESTED' || o.status === 'ORDERED')) {
  currentState = 'WAITING_PART' // Auto!
}

// Rule 2: All sub-orders resolved
if (sub_orders.every(o => o.status === 'ARRIVED' || o.status === 'CANCELLED')) {
  currentState = 'IN_PROGRESS' // Back!
}
```

**UI Feedback:**
- ✅ Sub-order dibuat → state jadi WAITING_PART
- ✅ Status sub-order selesai → state balik IN_PROGRESS

**Karakteristik:**
- 📌 Harga boleh diedit (estimasi)
- 📌 Bisa dipakai walau service gagal
- ❌ Tidak masuk POS
- ❌ Tidak affect stok real-time

---

#### 🔹 SECTION 6 — ESTIMASI BIAYA (UI ONLY)

**Component:** `NSCSum.tsx` ✅

```
┌───────────────────────────────────────────────────────┐
│ 💵 Estimasi Biaya (Non-Final)                         │
├───────────────────────────────────────────────────────┤
│ Estimasi Jasa (Opsional)                              │
│ [200000]                                              │
│                                                       │
│ ─────────────────────────────────────────────────     │
│ Ringkasan Estimasi Biaya                              │
│                                                       │
│ Sparepart (estimasi):         Rp 120,000             │
│ Jasa (estimasi):              Rp 200,000             │
│ ─────────────────────────────────────────────────     │
│ Total Estimasi:               Rp 320,000             │
│                                                       │
│ ⚠️ CATATAN PENTING: Estimasi bukan harga final dan   │
│ tidak masuk laporan keuangan. Harga final akan       │
│ muncul setelah service di-FINALIZED.                 │
└───────────────────────────────────────────────────────┘
```

**Warning Box (WAJIB):**
- Background: Amber
- Border: Amber
- Icon: ⚠️
- Text: Bold "CATATAN PENTING"

**Karakteristik:**
- ⚠️ Label merah kecil: "Estimasi ini bukan harga final"
- Editable (jasa field)
- Auto-calculate total
- Read-only display (finalized mode)

---

#### 🔹 SECTION 7 — FINAL RESULT & ROOT CAUSE

**Component:** `NSFinal.tsx` ✅

```
┌───────────────────────────────────────────────────────┐
│ 🏁 Final Result & Root Cause                          │
├───────────────────────────────────────────────────────┤
│ Service Result *                                      │
│ [Pilih hasil akhir service ▼]                         │
│                                                       │
│ ○ SUCCESS - Service berhasil, device fixed            │
│ ○ FAILED - Tidak bisa diperbaiki                      │
│ ○ CANCELLED - Dibatalkan customer                     │
│ ○ PARTIAL - Sebagian berhasil                         │
│ ○ CLAIM - Klaim garansi                               │
│                                                       │
│ ─────────────────────────────────────────────────     │
│ Root Cause *                                          │
│                                                       │
│ Kategori                                              │
│ [Pilih kategori ▼]                                    │
│ • Hardware • Software • User Error • Unknown          │
│                                                       │
│ Deskripsi Teknis (min. 10 karakter)                   │
│ ┌───────────────────────────────────────────────┐    │
│ │ Jelaskan penyebab utama kerusakan...          │    │
│ └───────────────────────────────────────────────┘    │
│ 0/10 karakter                                         │
│                                                       │
│ Catatan Tambahan (Opsional)                           │
│ ┌───────────────────────────────────────────────┐    │
│ │ [textarea]                                    │    │
│ └───────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────┘
```

**Validation Warning (if incomplete):**
```
⚠️ PERHATIAN: Final Result dan Root Cause wajib diisi 
lengkap sebelum FINALIZED.

• Service Result belum dipilih
• Root Cause Kategori belum dipilih
• Root Cause Deskripsi belum diisi
• Root Cause Deskripsi minimal 10 karakter (saat ini: 5)
```

**Success Indicator (if complete):**
```
✓ Siap untuk di-FINALIZED
```

**Karakteristik:**
- Belum ada efek apa-apa ke sistem sampai FINALIZED
- Validation real-time
- Character counter

---

#### 🔴 SECTION 8 — FOOTER ACTION (PENENTU)

```
┌───────────────────────────────────────────────────────┐
│ Left Side:                                            │
│ ✓ Siap untuk di-FINALIZED                             │
│ (or warning list if not ready)                        │
│                                                       │
│ Right Side:                                           │
│ [Batal]  [Finalize Service]                           │
└───────────────────────────────────────────────────────┘
```

**Klik "Finalize Service":**

**1. Confirm Dialog:**
```
Finalisasi nota service?

⚠️ Setelah di-FINALIZED:
- Semua data akan READ-ONLY
- Tidak bisa diedit ulang
- Harga final akan dikunci

Lanjutkan?

[Batal]  [Ya, Finalize]
```

**2. Setelah OK:**
- Page reload
- Semua field READ ONLY
- Badge: FINALIZED (Success / Failed)
- Toast: "✅ Nota service telah di-FINALIZED"

**Button State:**
- **Disabled:** if !canFinalize (gray, cursor not-allowed)
- **Enabled:** if canFinalize (green, primary)

---

#### 🔒 SECTION 9 — MODE FINALIZED (VIEW ONLY)

```
┌───────────────────────────────────────────────────────┐
│ 🔒 Nota Service Telah Di-FINALIZED                    │
│ Semua data dalam mode read-only.                     │
│ Tidak dapat diedit ulang.                            │
│                                                       │
│                          [Kembali ke List]            │
└───────────────────────────────────────────────────────┘
```

**UI Changes:**
- ✅ Semua tombol "Tambah" hilang
- ✅ Semua tombol "Edit" hilang
- ✅ Semua tombol "Hapus" hilang
- ✅ Semua input → text display
- ✅ Jadi arsip kerja (read-only)

**Color:** Green border & background  
**Icon:** 🔒 Lock icon

---

### VISUAL KONSEPTUAL → UI (SATU GARIS)

```
Dialog (Entry)
    ↓
List (Harian Teknisi)
    ↓
Detail (Kerja)
    ↓
Finalize (Confirm)
    ↓
Read Only (Arsip)
```

**Tidak ada:**
- ❌ Tab analisis
- ❌ Toggle state manual
- ❌ Diskon di sini
- ❌ POS di sini
