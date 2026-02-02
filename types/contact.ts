// OriginalName: ContactTypes
// ShortName: contact types

export interface Contact {
  id: string;
  nama: string;
  no_hp?: string;
  created_at: string;
  last_activity_at?: string;
}

export interface ContactLedger {
  id: string;
  contact_id: string;
  type: 'SERVICE' | 'ORDER';
  nota_type: 'NS' | 'NP';
  nota_id: string;
  
  device_brand?: string;
  device_model?: string;
  issue_category?: string; // LCD, Baterai, Papan Cas, dll
  issue_detail?: string;
  
  result?: 'SUCCESS' | 'FAILED'; // service only
  total_cost?: number;
  
  created_at: string;
}

// Aggregated summary per device
export interface DeviceSummary {
  device: string; // "Samsung A12"
  count: number;
  issues: {
    category: string;
    count: number;
  }[];
}

// Warning untuk frequent repair
export interface RepairWarning {
  device: string;
  count: number;
  message: string;
}
