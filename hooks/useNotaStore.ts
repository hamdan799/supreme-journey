// OriginalName: useNotaStore
// ShortName: useNotaStore
// LEDGER PATTERN - Event-sourced single source of truth

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { NotaService, NotaPesanan, NotaSummary } from '../types/nota';
import { useContactStore } from './useContactStore';

// ============================================================
// LEDGER ARCHITECTURE - Event Sourcing
// ============================================================

type NotaActionType =
  | 'NOTA_CREATED'
  | 'NOTA_UPDATED'
  | 'NOTA_STATUS_CHANGED'
  | 'NOTA_FINALIZED'
  | 'SUB_PESANAN_ADDED'
  | 'SUB_PESANAN_UPDATED'
  | 'SUB_PESANAN_STATUS_CHANGED'
  | 'NOTA_DELETED'
  // 🔧 BLUEPRINT: New events for service workflow
  | 'DIAGNOSIS_ADDED'
  | 'ACTION_LOG_ADDED'
  | 'TECHNICIAN_ASSIGNED'
  | 'TECHNICIAN_CHANGED'
  | 'SUB_ORDER_CREATED'
  | 'SUB_ORDER_UPDATED'
  | 'SPAREPART_ADDED'
  | 'SPAREPART_UPDATED'
  | 'SERVICE_FINALIZED';

interface NotaLedgerEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: NotaActionType;
  notaId: string;
  data: any;
  prevState?: Partial<NotaService>;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    reason?: string;
  };
}

const LEDGER_STORAGE_KEY = 'inventory_nota_ledger';
const USER_ID_KEY = 'current_user_id'; // Fallback for user tracking

// ============================================================
// LEDGER PERSISTENCE
// ============================================================

function loadLedger(): NotaLedgerEntry[] {
  try {
    const stored = localStorage.getItem(LEDGER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('❌ Error loading nota ledger:', error);
    toast.error('Gagal memuat ledger nota');
    return [];
  }
}

function saveLedger(ledger: NotaLedgerEntry[]): void {
  try {
    localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(ledger));
  } catch (error) {
    console.error('❌ Error saving nota ledger:', error);
    toast.error('Gagal menyimpan ledger nota');
  }
}

function getCurrentUserId(): string {
  return localStorage.getItem(USER_ID_KEY) || 'system';
}

// ============================================================
// STATE RECONSTRUCTION FROM LEDGER
// ============================================================

function reconstructNotaState(ledger: NotaLedgerEntry[]): NotaService[] {
  const notaMap = new Map<string, NotaService>();

  // Replay all events in chronological order
  for (const entry of ledger) {
    const { action, notaId, data } = entry;

    switch (action) {
      case 'NOTA_CREATED': {
        notaMap.set(notaId, data as NotaService);
        break;
      }

      case 'NOTA_UPDATED': {
        const existing = notaMap.get(notaId);
        if (existing) {
          notaMap.set(notaId, {
            ...existing,
            ...data,
            updatedAt: entry.timestamp,
          });
        }
        break;
      }

      case 'NOTA_STATUS_CHANGED': {
        const existing = notaMap.get(notaId);
        if (existing) {
          const updates: Partial<NotaService> = {
            status: data.newStatus,
            updatedAt: entry.timestamp,
          };

          if (data.newStatus === 'Selesai') {
            updates.completedAt = entry.timestamp;
          }

          notaMap.set(notaId, { ...existing, ...updates });
        }
        break;
      }

      case 'NOTA_FINALIZED': {
        const existing = notaMap.get(notaId);
        if (existing) {
          notaMap.set(notaId, {
            ...existing,
            service_state: 'FINALIZED',
            service_result: data.service_result,
            root_cause: data.root_cause,
            harga_final: data.harga_final,
            finalized_at: entry.timestamp,
            updatedAt: entry.timestamp,
          });
        }
        break;
      }

      case 'SUB_PESANAN_ADDED': {
        const existing = notaMap.get(notaId);
        if (existing) {
          const newSubPesanan = [...(existing.subPesanan || []), data];
          notaMap.set(notaId, {
            ...existing,
            subPesanan: newSubPesanan,
            updatedAt: entry.timestamp,
          });
        }
        break;
      }

      case 'SUB_PESANAN_UPDATED': {
        const existing = notaMap.get(notaId);
        if (existing && existing.subPesanan) {
          const updatedSubPesanan = existing.subPesanan.map((sub) =>
            sub.id === data.pesananId ? { ...sub, ...data.updates } : sub
          );
          notaMap.set(notaId, {
            ...existing,
            subPesanan: updatedSubPesanan,
            updatedAt: entry.timestamp,
          });
        }
        break;
      }

      case 'SUB_PESANAN_STATUS_CHANGED': {
        const existing = notaMap.get(notaId);
        if (existing && existing.subPesanan) {
          const updatedSubPesanan = existing.subPesanan.map((sub) =>
            sub.id === data.pesananId
              ? { ...sub, status: data.newStatus }
              : sub
          );
          notaMap.set(notaId, {
            ...existing,
            subPesanan: updatedSubPesanan,
            updatedAt: entry.timestamp,
          });
        }
        break;
      }

      case 'NOTA_DELETED': {
        // ✅ LOGICAL DELETE - Set status to DELETED, keep in ledger
        const existing = notaMap.get(notaId);
        if (existing) {
          notaMap.set(notaId, {
            ...existing,
            service_state: 'DELETED',
            updatedAt: entry.timestamp,
          });
        }
        break;
      }

      default:
        console.warn('⚠️ Unknown ledger action:', action);
    }
  }

  // Filter out deleted nota from active view
  return Array.from(notaMap.values()).filter(
    (nota) => nota.service_state !== 'DELETED'
  );
}

// ============================================================
// LEDGER EVENT CREATOR
// ============================================================

function createLedgerEntry(
  action: NotaActionType,
  notaId: string,
  data: any,
  prevState?: Partial<NotaService>
): NotaLedgerEntry {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    userId: getCurrentUserId(),
    action,
    notaId,
    data,
    prevState,
    metadata: {
      userAgent: navigator.userAgent,
    },
  };
}

// ============================================================
// MAIN HOOK
// ============================================================

export function useNotaStore() {
  const [ledger, setLedger] = useState<NotaLedgerEntry[]>([]);
  const [notaList, setNotaList] = useState<NotaService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load ledger and reconstruct state
  useEffect(() => {
    try {
      const loadedLedger = loadLedger();
      setLedger(loadedLedger);
      const reconstructed = reconstructNotaState(loadedLedger);
      setNotaList(reconstructed);
      console.log('✅ Nota ledger loaded:', {
        totalEvents: loadedLedger.length,
        activeNota: reconstructed.length,
      });
    } catch (error) {
      console.error('❌ Error loading nota:', error);
      toast.error('Gagal memuat data nota');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Append event to ledger and update state
  const appendToLedger = (entry: NotaLedgerEntry) => {
    const newLedger = [...ledger, entry];
    setLedger(newLedger);
    saveLedger(newLedger);

    // Reconstruct state
    const newState = reconstructNotaState(newLedger);
    setNotaList(newState);
    
    // 🔥 AUTO-CREATE CONTACT LEDGER
    handleContactLedgerCreation(entry);
  };
  
  // 🔥 Handle Contact Ledger Creation
  const handleContactLedgerCreation = (entry: NotaLedgerEntry) => {
    const { action, notaId, data } = entry;
    const { createContact, getContactByPhone, createLedger } = useContactStore.getState();
    
    // 1. SERVICE FINALIZED
    if (action === 'NOTA_FINALIZED') {
      const nota = notaList.find((n) => n.id === notaId);
      if (!nota || nota.type !== 'service') return;
      
      // Get or create contact
      let contactId: string | undefined;
      if (nota.nomorHp) {
        const existingContact = getContactByPhone(nota.nomorHp);
        if (existingContact) {
          contactId = existingContact.id;
        } else if (nota.namaPelanggan) {
          contactId = createContact({
            nama: nota.namaPelanggan,
            no_hp: nota.nomorHp,
          });
        }
      }
      
      // Create ledger entry
      if (contactId) {
        createLedger({
          contact_id: contactId,
          type: 'SERVICE',
          nota_type: 'NS',
          nota_id: nota.noNota || notaId,
          device_brand: nota.merk,
          device_model: nota.tipe,
          issue_category: nota.keluhan,
          result: data.service_result === 'Berhasil' ? 'SUCCESS' : 'FAILED',
          total_cost: data.harga_final,
        });
      }
    }
    
    // 2. ORDER PAID (NotaPesananDoc)
    if (action === 'NOTA_STATUS_CHANGED' && data.newStatus === 'PAID') {
      // Find nota in reconstructed state
      const updatedState = reconstructNotaState([...ledger, entry]);
      const nota = updatedState.find((n) => n.id === notaId);
      
      // Check if it's NotaPesananDoc (has customer_phone field)
      if (nota && 'customer_phone' in nota && 'customer_name' in nota) {
        const pesananNota = nota as any; // NotaPesananDoc
        
        // Get or create contact
        let contactId: string | undefined;
        if (pesananNota.customer_phone) {
          const existingContact = getContactByPhone(pesananNota.customer_phone);
          if (existingContact) {
            contactId = existingContact.id;
          } else if (pesananNota.customer_name) {
            contactId = createContact({
              nama: pesananNota.customer_name,
              no_hp: pesananNota.customer_phone,
            });
          }
        }
        
        // Create ledger entry
        if (contactId) {
          createLedger({
            contact_id: contactId,
            type: 'ORDER',
            nota_type: 'NP',
            nota_id: pesananNota.noNota || notaId,
            total_cost: pesananNota.total_akhir,
          });
        }
      }
    }
  };

  // Generate Nota Number
  const generateNotaNumber = (): string => {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    const todayNota = notaList.filter(
      (n) => n.tanggal === today.toISOString().split('T')[0]
    );
    const sequence = (todayNota.length + 1).toString().padStart(3, '0');

    return `NT${year}${month}${day}${sequence}`;
  };

  // ============================================================
  // LEDGER ACTIONS
  // ============================================================

  // Create Nota
  const createNota = (
    nota: Omit<NotaService, 'id' | 'noNota' | 'createdAt' | 'updatedAt'>
  ): NotaService => {
    const newNota: NotaService = {
      ...nota,
      id: crypto.randomUUID(),
      noNota: generateNotaNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const entry = createLedgerEntry('NOTA_CREATED', newNota.id, newNota);
    appendToLedger(entry);

    toast.success(`Nota ${newNota.noNota} berhasil dibuat`);
    return newNota;
  };

  // Update Nota
  const updateNota = (id: string, updates: Partial<NotaService>) => {
    const existing = notaList.find((n) => n.id === id);
    if (!existing) {
      toast.error('Nota tidak ditemukan');
      return;
    }

    // Guard: Cannot update finalized nota
    if (existing.service_state === 'FINALIZED') {
      toast.warning('Nota sudah FINALIZED, tidak dapat diubah');
      return;
    }

    const entry = createLedgerEntry('NOTA_UPDATED', id, updates, existing);
    appendToLedger(entry);

    toast.success('Nota berhasil diperbarui');
  };

  // Update Status (with side effects)
  const updateStatus = (id: string, newStatus: NotaService['status']) => {
    const nota = notaList.find((n) => n.id === id);
    if (!nota) {
      toast.error('Nota tidak ditemukan');
      return;
    }

    // Guard: Cannot change status of finalized nota
    if (nota.service_state === 'FINALIZED') {
      toast.warning('Nota sudah FINALIZED, tidak dapat mengubah status');
      return;
    }

    const entry = createLedgerEntry(
      'NOTA_STATUS_CHANGED',
      id,
      { newStatus },
      { status: nota.status }
    );
    appendToLedger(entry);

    // Side effects based on status
    if (newStatus === 'Selesai') {
      toast.success(`Service ${nota.noNota} selesai! HP siap diambil`);
    }

    if (newStatus === 'Diambil') {
      toast.info(`Pilih status pembayaran untuk ${nota.noNota}`);
    }
  };

  // Add Sub-Pesanan
  const addSubPesanan = (notaId: string, pesanan: NotaPesanan) => {
    const nota = notaList.find((n) => n.id === notaId);
    if (!nota) {
      toast.error('Nota tidak ditemukan');
      return;
    }

    if (nota.service_state === 'FINALIZED') {
      toast.warning('Nota sudah FINALIZED, tidak dapat menambah sub-pesanan');
      return;
    }

    const entry = createLedgerEntry('SUB_PESANAN_ADDED', notaId, pesanan);
    appendToLedger(entry);

    toast.success('Sub-pesanan berhasil ditambahkan');
  };

  // Update Sub-Pesanan
  const updateSubPesanan = (
    notaId: string,
    pesananId: string,
    updates: Partial<NotaPesanan>
  ) => {
    const nota = notaList.find((n) => n.id === notaId);
    if (!nota || !nota.subPesanan) {
      toast.error('Nota atau sub-pesanan tidak ditemukan');
      return;
    }

    if (nota.service_state === 'FINALIZED') {
      toast.warning('Nota sudah FINALIZED, tidak dapat mengubah sub-pesanan');
      return;
    }

    const entry = createLedgerEntry('SUB_PESANAN_UPDATED', notaId, {
      pesananId,
      updates,
    });
    appendToLedger(entry);

    toast.success('Sub-pesanan berhasil diperbarui');
  };

  // Update Sub-Pesanan Status
  const updateSubPesananStatus = (
    notaId: string,
    pesananId: string,
    newStatus: NotaPesanan['status']
  ) => {
    const nota = notaList.find((n) => n.id === notaId);
    if (!nota || !nota.subPesanan) {
      toast.error('Nota atau sub-pesanan tidak ditemukan');
      return;
    }

    if (nota.service_state === 'FINALIZED') {
      toast.warning('Nota sudah FINALIZED, tidak dapat mengubah status sub-pesanan');
      return;
    }

    const entry = createLedgerEntry('SUB_PESANAN_STATUS_CHANGED', notaId, {
      pesananId,
      newStatus,
    });
    appendToLedger(entry);

    // Side effects
    if (newStatus === 'Ada') {
      toast.success('Produk masuk ke Product Management');
      // Component will handle stock update
    }

    if (newStatus === 'Selesai') {
      toast.success('Pesanan selesai, tercatat di transaksi');
      // Component will handle transaction creation
    }
  };

  // Delete Nota
  const deleteNota = (id: string) => {
    const nota = notaList.find((n) => n.id === id);
    if (!nota) {
      toast.error('Nota tidak ditemukan');
      return;
    }

    // Guard: Cannot delete finalized nota
    if (nota.service_state === 'FINALIZED') {
      toast.error('Nota sudah FINALIZED, tidak dapat dihapus');
      return;
    }

    const entry = createLedgerEntry('NOTA_DELETED', id, null, nota);
    appendToLedger(entry);

    toast.success('Nota berhasil dihapus');
  };

  // Finalize Nota Service
  const finalizeNota = (
    id: string,
    finalData: {
      service_result: string;
      root_cause: {
        kategori: string;
        deskripsi: string;
        catatan?: string;
      };
      harga_final?: number;
    }
  ) => {
    const nota = notaList.find((n) => n.id === id);
    if (!nota) {
      toast.error('Nota tidak ditemukan');
      return;
    }

    // Guard: Check if already finalized
    if (nota.service_state === 'FINALIZED') {
      toast.warning('Nota sudah di-FINALIZED');
      return;
    }

    // Guard: Validate required fields
    if (
      !finalData.service_result ||
      !finalData.root_cause?.kategori ||
      !finalData.root_cause?.deskripsi
    ) {
      toast.error('Final Result dan Root Cause wajib diisi');
      return;
    }

    if (finalData.root_cause.deskripsi.length < 10) {
      toast.error('Root Cause deskripsi minimal 10 karakter');
      return;
    }

    // Guard: Check active sub-orders
    const hasActiveSub = nota.subPesanan?.some(
      (sub: any) => sub.status === 'REQUESTED' || sub.status === 'ORDERED'
    );
    if (hasActiveSub) {
      toast.error('Tidak bisa finalized: masih ada sub-order aktif');
      return;
    }

    // Calculate harga_final if not provided
    const hargaFinal =
      finalData.harga_final ||
      (nota.estimasiBiaya || 0) +
        (nota.subPesanan?.reduce(
          (sum: number, sub: any) => sum + sub.harga * sub.qty,
          0
        ) || 0);

    const finalizeData = {
      service_result: finalData.service_result,
      root_cause: finalData.root_cause,
      harga_final: hargaFinal,
    };

    const entry = createLedgerEntry('NOTA_FINALIZED', id, finalizeData, nota);
    appendToLedger(entry);

    toast.success('✅ Nota service telah di-FINALIZED');
  };

  // ============================================================
  // QUERY FUNCTIONS
  // ============================================================

  const getSummary = (): NotaSummary => {
    const today = new Date().toISOString().split('T')[0];
    const todayNota = notaList.filter((n) => n.tanggal === today);

    const serviceNota = todayNota.filter((n) => n.type === 'service');
    const pesananNota = todayNota.filter((n) => n.type === 'pesanan');

    const totalEstimasi = serviceNota.reduce(
      (sum, n) => sum + (n.estimasiBiaya || 0),
      0
    );
    const avgEstimasi =
      serviceNota.length > 0 ? totalEstimasi / serviceNota.length : 0;

    const totalNominal = pesananNota.reduce(
      (sum, n) => sum + (n.total || 0),
      0
    );

    return {
      totalNotaHariIni: serviceNota.length,
      statusDalamProses: serviceNota.filter((n) => n.status === 'Proses')
        .length,
      serviceSelesai: serviceNota.filter(
        (n) => n.status === 'Selesai' || n.status === 'Diambil'
      ).length,
      rataRataEstimasi: avgEstimasi,
      totalPesananHariIni: pesananNota.length,
      pesananProses: pesananNota.filter((n) => n.status === 'Proses').length,
      pesananAda: notaList.filter((n) =>
        n.subPesanan?.some((sub) => sub.status === 'Ada')
      ).length,
      pesananSelesai: pesananNota.filter((n) => n.status === 'Selesai').length,
      totalNominal,
    };
  };

  const getNotaById = (id: string) => notaList.find((n) => n.id === id);

  const getServiceNota = () => notaList.filter((n) => n.type === 'service');

  const getPesananNota = () => notaList.filter((n) => n.type === 'pesanan');

  // Detect repeat service
  const detectRepeatService = (
    customerPhone: string,
    brandHP: string,
    detectedDamageTypes: string[]
  ): {
    isRepeat: boolean;
    daysSinceLastService: number | null;
    lastServiceDate: string | null;
    lastServiceId: string | null;
  } => {
    const customerHistory = notaList.filter(
      (n) =>
        n.type === 'service' &&
        n.nomorHp === customerPhone &&
        (n.status === 'Selesai' || n.status === 'Diambil') &&
        n.completedAt
    );

    if (customerHistory.length === 0) {
      return {
        isRepeat: false,
        daysSinceLastService: null,
        lastServiceDate: null,
        lastServiceId: null,
      };
    }

    const matchingServices = customerHistory.filter((service) => {
      const isSameBrand =
        service.merk?.toLowerCase() === brandHP.toLowerCase();

      const hasMatchingDamage = detectedDamageTypes.some((damage) =>
        service.detected_damage_types?.some(
          (prevDamage) => prevDamage.toLowerCase() === damage.toLowerCase()
        )
      );

      return isSameBrand && hasMatchingDamage;
    });

    if (matchingServices.length === 0) {
      return {
        isRepeat: false,
        daysSinceLastService: null,
        lastServiceDate: null,
        lastServiceId: null,
      };
    }

    const sortedServices = matchingServices.sort((a, b) => {
      const dateA = new Date(a.completedAt || a.updatedAt);
      const dateB = new Date(b.completedAt || b.updatedAt);
      return dateB.getTime() - dateA.getTime();
    });

    const lastService = sortedServices[0];
    const lastServiceDate = new Date(
      lastService.completedAt || lastService.updatedAt
    );
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastServiceDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isRepeat = diffDays <= 60;

    return {
      isRepeat,
      daysSinceLastService: diffDays,
      lastServiceDate: lastService.completedAt || lastService.updatedAt,
      lastServiceId: lastService.id,
    };
  };

  // Get customer history
  const getCustomerHistory = (
    customerPhone: string,
    limit = 5
  ): NotaService[] => {
    return notaList
      .filter(
        (n) =>
          n.type === 'service' &&
          n.nomorHp === customerPhone &&
          (n.status === 'Selesai' || n.status === 'Diambil')
      )
      .sort((a, b) => {
        const dateA = new Date(a.completedAt || a.updatedAt);
        const dateB = new Date(b.completedAt || b.updatedAt);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
  };

  // ============================================================
  // LEDGER UTILITIES (for debugging & audit)
  // ============================================================

  const getLedgerHistory = (notaId?: string): NotaLedgerEntry[] => {
    if (notaId) {
      return ledger.filter((entry) => entry.notaId === notaId);
    }
    return ledger;
  };

  const exportLedger = (): string => {
    return JSON.stringify(ledger, null, 2);
  };

  // ============================================================
  // ADMIN UTILITIES (recovery & audit)
  // ============================================================

  /**
   * Get all deleted nota (for recovery/audit purposes)
   * Only accessible to admin via direct hook call
   */
  const getDeletedNota = (): NotaService[] => {
    const allNota = reconstructNotaStateIncludingDeleted(ledger);
    return allNota.filter((nota) => nota.service_state === 'DELETED');
  };

  /**
   * Internal: Reconstruct ALL nota including deleted ones
   */
  function reconstructNotaStateIncludingDeleted(
    ledger: NotaLedgerEntry[]
  ): NotaService[] {
    const notaMap = new Map<string, NotaService>();

    for (const entry of ledger) {
      const { action, notaId, data } = entry;

      switch (action) {
        case 'NOTA_CREATED':
          notaMap.set(notaId, data as NotaService);
          break;
        case 'NOTA_UPDATED':
          const existing = notaMap.get(notaId);
          if (existing) {
            notaMap.set(notaId, {
              ...existing,
              ...data,
              updatedAt: entry.timestamp,
            });
          }
          break;
        case 'NOTA_DELETED':
          const existingNota = notaMap.get(notaId);
          if (existingNota) {
            notaMap.set(notaId, {
              ...existingNota,
              service_state: 'DELETED',
              updatedAt: entry.timestamp,
            });
          }
          break;
        // ... other cases handled in main reconstructNotaState
      }
    }

    return Array.from(notaMap.values());
  }

  return {
    notaList,
    isLoading,
    createNota,
    updateNota,
    updateStatus,
    addSubPesanan,
    updateSubPesanan,
    updateSubPesananStatus,
    deleteNota,
    getSummary,
    getNotaById,
    getServiceNota,
    getPesananNota,
    detectRepeatService,
    getCustomerHistory,
    finalizeNota,
    // Ledger utilities
    getLedgerHistory,
    exportLedger,
    // Admin utilities (recovery)
    getDeletedNota,
  };
}