// ============================================================
// SUPPORTING TYPES
// ============================================================

// 🔧 BLUEPRINT: Action Log (Timeline tindakan teknisi)
export interface ActionLog {
  id: string;
  timestamp: string; // ISO datetime
  deskripsi: string; // Required - what action was taken
  hasil?: string; // Optional - result of action
  teknisi?: string; // Optional - technician name
}

// 🧱 BLUEPRINT FINAL: Sub-Order (Sparepart perlu dipesan)
// SUB ORDER = JANJI BARANG UNTUK SERVICE, BUKAN BARANG TOKO
// SUB ORDER ≠ INVENTORY
export interface SubOrder {
  id: string;
  sparepart: string;           // Nama barang
  kategori?: string;            // Kategori barang
  qty: number;                  // Quantity
  estimasi_harga_jual: number;  // Estimasi harga jual
  estimasi_modal: number;       // Estimasi modal
  
  // 🔒 STATUS LIFECYCLE (FINAL)
  // DIPESAN → ADA → DIPASANG
  //            ↓
  //         CANCEL
  status: 'DIPESAN' | 'ADA' | 'DIPASANG' | 'CANCEL';
  
  // TIMESTAMPS
  created_at: string;           // Saat dibuat
  updated_at?: string;          // Saat diupdate
  status_changed_at?: string;   // Saat status berubah
  
  // 🚨 DECISION OUTCOME (jika CANCEL dari ADA)
  cancel_decision?: {
    action: 'JADIKAN_KONTER' | 'RETUR' | 'SCRAP';
    notes?: string;
    decided_at: string;
    decided_by?: string;
    
    // Jika JADIKAN_KONTER
    product_id?: string;        // Link ke products (jika jadi konter)
  };
  
  // DEPRECATED (backward compatibility)
  supplier?: string;            // Use kategori instead
  estimasi_harga?: number;      // Use estimasi_harga_jual instead
}

// BLUEPRINT: Service State (workflow machine)
export type ServiceState =
  | 'DRAFT'
  | 'IN_PROGRESS'
  | 'WAITING_PART'
  | 'FINALIZED'
  | 'DELETED';

// BLUEPRINT: Final Result (saat FINALIZED)
export type FinalResult =
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'PARTIAL'
  | 'CLAIM';

// BLUEPRINT: Root Cause (mandatory saat finalize)
export interface RootCause {
  kategori?: string; // Damage category
  cause: string; // Root cause description (min 10 char)
  rekomendasi?: string; // Recommendations
}

// Damage Type Interface for standardized damage/keluhan
export interface DamageType {
  id: string;
  name: string;
  description?: string;
  category?: string; // e.g., 'Hardware', 'Software', 'Physical'
  createdAt: Date;
  updatedAt: Date;
}

// BLUEPRINT: New Sparepart Status System
export type SparepartStatus = 'USED' | 'TESTED_UNUSED' | 'REPLACED_BY' | 'NEED_ORDER' | 'NOT_USED';

// ============================================================
// NOTA PESANAN - AKTA KEUANGAN (FINAL BLUEPRINT)
// ============================================================

// 🧾 NOTA PESANAN (Root Document)
// Ini adalah transaksi final yang bisa dari Service atau Direct
export interface NotaPesananDoc {
  id: string;
  noNota: string;
  tanggal: string;
  
  // SOURCE
  source_type: 'SERVICE' | 'DIRECT';
  source_id?: string; // notaServiceId jika dari service
  
  // CUSTOMER
  customer_name: string;
  customer_phone: string;
  
  // ITEMS
  items: NotaPesananItem[];
  
  // PRICING
  subtotal: number;
  diskon: number;
  markup: number;
  total_akhir: number;
  
  // PAYMENT
  pembayaran: {
    metode: 'Cash' | 'Transfer' | 'QRIS' | 'Hutang';
    dibayar: number;
    kembalian: number;
  };
  
  // STATUS
  status: 'DRAFT' | 'PAID' | 'CANCELLED';
  
  // TIMESTAMPS
  createdAt: string;
  updatedAt: string;
  paid_at?: string;
  cancelled_at?: string;
  
  // METADATA
  catatan?: string;
  created_by?: string;
  paid_by?: string;
}

// 🛒 NOTA PESANAN ITEM (Line Item)
// Item dalam nota bisa dari 3 sumber berbeda
export interface NotaPesananItem {
  id: string;
  nama: string;
  kategori: string;
  qty: number;
  
  // PRICING (SNAPSHOT - tidak ambil dari DB!)
  harga_jual: number;
  modal: number;
  
  // SOURCE TRACKING
  source: 'INVENTORY' | 'SUB_ORDER' | 'JASA';
  source_id?: string; // productId atau subOrderId
  
  // METADATA (optional)
  keterangan?: string;
}

// ============================================================
// LEGACY: OLD NotaPesanan (for backward compatibility)
// ============================================================
export interface NotaPesanan {
  id: string;
  produk: string;
  kategori: string;
  qty: number;
  harga: number; // Harga jual
  modal: number; // Harga modal
  status: 'Proses' | 'Ada' | 'Selesai';
  fromCatalog?: boolean; // true = dari catalog picker, false/undefined = manual input
  
  // BLUEPRINT: Sparepart Tracking (for Service sub-pesanan)
  product_id?: string; // Link to products collection
  brand_sparepart?: string | null; // Brand sparepart snapshot
  sparepart_quality?: string | null; // Quality snapshot
  vendor_id?: string | null; // Vendor snapshot
  cost_snapshot?: number; // Modal saat dipakai di service
  sell_price_snapshot?: number; // Harga jual saat dipakai di service
  
  // BLUEPRINT: New Sparepart Status System
  sparepart_status?: SparepartStatus; // USED/TESTED_UNUSED/etc
  replaced_by?: string; // ID sparepart pengganti (if REPLACED_BY)
}

export interface NotaService {
  id: string;
  noNota: string;
  tanggal: string;
  type: 'service' | 'pesanan';
  
  // Customer Info
  namaPelanggan?: string;
  nomorHp?: string;
  
  // 🔧 BLUEPRINT: Penerima Nota (user yang terima device)
  penerimaNota?: string; // Username/ID user yang terima
  
  // BLUEPRINT: Service Device Info (Enhanced for Analytics)
  merk?: string; // Brand HP - akan link ke phone_brands
  tipe?: string; // Model HP - akan link ke phone_models
  brand_hp?: string; // Normalized brand name
  model_hp?: string; // Normalized model name
  imei?: string;
  sandi?: string;
  kelengkapan?: string[];
  
  // BLUEPRINT: Keluhan & AI Diagnosis
  keluhan?: string; // Raw text input (free text)
  keluhan_tags?: string[]; // AI-processed tags untuk pattern matching
  detected_damage_types?: string[]; // Auto-detected damage types from keluhan
  
  // 🔧 BLUEPRINT: Estimasi Awal (TEXT - non-structural)
  estimasi_awal_text?: string; // "± 300–500rb" atau "Belum bisa dipastikan"
  
  // BLUEPRINT: Diagnosis (new fields)
  diagnosis_awal?: string; // Initial diagnosis
  hasil_pengecekan?: string[]; // Checklist steps
  indikasi_kerusakan?: string; // Damage indication
  
  estimasiBiaya?: number; // Structural estimate (calculated)
  harga_service?: number; // Actual service fee charged
  
  // 🔧 BLUEPRINT: Pelaksana Service (Technician)
  primary_technician?: string; // Username/ID teknisi utama
  technician_history?: Array<{
    technician: string;
    assigned_at: string;
    assigned_by?: string;
  }>; // Audit trail perubahan teknisi
  
  // BLUEPRINT: Repeat Service Detection (Task #18)
  repeat_service?: boolean; // true if same damage within 60 days
  selisih_hari_rusak_ulang?: number; // days since last service with same damage
  last_service_date?: string; // ISO date of last service
  last_service_id?: string; // ID of the previous service nota
  
  // BLUEPRINT: Sparepart Tracking (Enhanced sub-pesanan)
  subPesanan?: NotaPesanan[]; // Includes sparepart quality, vendor, snapshots
  sparepart_used?: SparepartUsed[]; // Alternative structure for analytics
  catatan?: string;
  total?: number;
  
  // BLUEPRINT: Action Log & Sub-Orders
  action_logs?: ActionLog[]; // Multi-step technician workflow
  sub_orders?: SubOrder[]; // Sparepart yang perlu dipesan
  
  // BLUEPRINT: State Machine & Final Result
  service_state?: ServiceState; // DRAFT → ... → FINALIZED
  final_result?: FinalResult; // SUCCESS/FAILED/etc
  service_result?: FinalResult; // Alias for final_result
  root_cause?: RootCause; // Mandatory saat FINALIZED
  
  // 🔧 BLUEPRINT: Finalized metadata
  finalized_at?: string; // ISO timestamp
  finalized_by?: string; // User who finalized
  harga_final?: number; // Locked price snapshot
  
  // Status (legacy - kept for backward compatibility)
  status: 'Proses' | 'Selesai' | 'Diambil';
  
  // Payment (when status = 'Diambil' or 'Selesai')
  paymentStatus?: 'Lunas' | 'Hutang';
  paymentMethod?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// BLUEPRINT: Sparepart Used Tracking (for Analytics)
export interface SparepartUsed {
  product_id: string;
  name: string;
  brand_sparepart?: string | null;
  sparepart_quality?: string | null;
  vendor_id?: string | null;
  vendor_name?: string;
  cost_snapshot: number;
  sell_price_snapshot: number;
  qty: number;
}

export interface NotaSummary {
  totalNotaHariIni: number;
  statusDalamProses: number;
  serviceSelesai: number;
  rataRataEstimasi: number;
  totalPesananHariIni: number;
  pesananProses: number;
  pesananAda: number;
  pesananSelesai: number;
  totalNominal: number;
}

// 📊 NOTA PESANAN SUMMARY (untuk NPSCard)
export interface NotaPesananSummary {
  total_draft: number;
  total_paid: number;
  total_cancelled: number;
  total_hari_ini: number;
  nominal_hari_ini: number;
}