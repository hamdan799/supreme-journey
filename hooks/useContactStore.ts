// OriginalName: useContactStore
// ShortName: contact store

import { create } from 'zustand';
import type { Contact, ContactLedger } from '../types/contact';

interface ContactStore {
  contacts: Contact[];
  ledgers: ContactLedger[];
  
  // Contact CRUD
  createContact: (contact: Omit<Contact, 'id' | 'created_at'>) => string;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  getContactById: (id: string) => Contact | undefined;
  getContactByPhone: (phone: string) => Contact | undefined;
  
  // Ledger (append-only)
  createLedger: (ledger: Omit<ContactLedger, 'id' | 'created_at'>) => void;
  getLedgersByContact: (contactId: string) => ContactLedger[];
  
  // Analytics
  getContactSummary: (contactId: string) => {
    totalServices: number;
    totalOrders: number;
    devices: { device: string; count: number; issues: { category: string; count: number; }[] }[];
    warnings: { device: string; count: number; message: string; }[];
  };
}

export const useContactStore = create<ContactStore>((set, get) => ({
  contacts: [],
  ledgers: [],
  
  createContact: (contact) => {
    const newContact: Contact = {
      id: `CONT-${Date.now()}`,
      ...contact,
      created_at: new Date().toISOString(),
    };
    
    set((state) => ({
      contacts: [...state.contacts, newContact],
    }));
    
    return newContact.id;
  },
  
  updateContact: (id, updates) => {
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  },
  
  deleteContact: (id) => {
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
      ledgers: state.ledgers.filter((l) => l.contact_id !== id),
    }));
  },
  
  getContactById: (id) => {
    return get().contacts.find((c) => c.id === id);
  },
  
  getContactByPhone: (phone) => {
    return get().contacts.find((c) => c.no_hp === phone);
  },
  
  createLedger: (ledger) => {
    const newLedger: ContactLedger = {
      id: `LEDG-${Date.now()}`,
      ...ledger,
      created_at: new Date().toISOString(),
    };
    
    set((state) => ({
      ledgers: [...state.ledgers, newLedger],
    }));
    
    // Update contact last_activity_at
    get().updateContact(ledger.contact_id, {
      last_activity_at: new Date().toISOString(),
    });
  },
  
  getLedgersByContact: (contactId) => {
    return get().ledgers
      .filter((l) => l.contact_id === contactId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },
  
  getContactSummary: (contactId) => {
    const ledgers = get().getLedgersByContact(contactId);
    
    const totalServices = ledgers.filter((l) => l.type === 'SERVICE').length;
    const totalOrders = ledgers.filter((l) => l.type === 'ORDER').length;
    
    // Aggregate by device
    const deviceMap = new Map<string, { count: number; issues: Map<string, number> }>();
    
    ledgers.forEach((l) => {
      if (l.device_brand && l.device_model) {
        const device = `${l.device_brand} ${l.device_model}`;
        
        if (!deviceMap.has(device)) {
          deviceMap.set(device, { count: 0, issues: new Map() });
        }
        
        const deviceData = deviceMap.get(device)!;
        deviceData.count += 1;
        
        if (l.issue_category) {
          const issueCount = deviceData.issues.get(l.issue_category) || 0;
          deviceData.issues.set(l.issue_category, issueCount + 1);
        }
      }
    });
    
    // Convert to array
    const devices = Array.from(deviceMap.entries()).map(([device, data]) => ({
      device,
      count: data.count,
      issues: Array.from(data.issues.entries())
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count),
    })).sort((a, b) => b.count - a.count);
    
    // Generate warnings
    const warnings = devices
      .filter((d) => d.count >= 5)
      .map((d) => ({
        device: d.device,
        count: d.count,
        message: `Device ${d.device} diservice ${d.count}x. Disarankan edukasi ganti unit.`,
      }));
    
    return {
      totalServices,
      totalOrders,
      devices,
      warnings,
    };
  },
}));
