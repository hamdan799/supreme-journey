// OriginalName: analyticsTypes
// ShortName: AnalyticsTypes

// BLUEPRINT: Analytics Collections for Product & Service Intelligence

/**
 * BLUEPRINT Collection: repair_stats
 * Menyimpan histori dan probabilitas hasil AI untuk setiap model HP
 */
export interface RepairStats {
  id: string;
  model_hp: string; // Model HP (e.g., "Redmi Note 10")
  brand_hp?: string; // Brand HP (e.g., "Xiaomi")
  total_repair: number; // Total service count
  success_rate: number; // Percentage of successful repairs
  average_cost: number; // Average repair cost
  sparepart_failure_rate: Record<string, number>; // { "LCD": 0.25, "Battery": 0.15 }
  common_damage: string[]; // Most common damage types
  createdAt: Date;
  updatedAt: Date;
}

/**
 * BLUEPRINT Collection: brand_sparepart_stats
 * Untuk melihat brand sparepart mana yang punya return/failure rate tinggi
 */
export interface BrandSparepartStats {
  id: string;
  brand_sparepart: string; // Brand name (or "Brandless")
  quality: string | null; // Grade S/A/B/C/D/Anomali
  total_used: number; // Total times used in service
  return_count: number; // Number of repeat services with same sparepart
  return_rate: number; // Percentage (return_count / total_used)
  vendor_correlation: Record<string, {
    vendor_id: string;
    vendor_name: string;
    total_supplied: number;
    return_count: number;
    return_rate: number;
  }>; // Tracking per vendor performance
  average_lifespan_days: number; // Average days before failure
  createdAt: Date;
  updatedAt: Date;
}

/**
 * BLUEPRINT Collection: model_failure_stats
 * Menangkap pola kerusakan berdasarkan model HP
 */
export interface ModelFailureStats {
  id: string;
  brand_hp: string;
  model_hp: string;
  total_services: number;
  failure_patterns: FailurePattern[];
  most_common_damage: string; // Top damage type
  average_repair_days: number; // Average time to repair
  repeat_service_rate: number; // Percentage of repeat services
  recommended_spareparts: RecommendedSparepart[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FailurePattern {
  damage_type: string;
  occurrence_count: number;
  percentage: number;
  common_spareparts: string[]; // Most used spareparts for this damage
  average_cost: number;
}

export interface RecommendedSparepart {
  name: string;
  brand_sparepart?: string;
  quality: string;
  usage_count: number;
  success_rate: number; // Based on no-repeat-service
  average_cost: number;
}

/**
 * BLUEPRINT: AI Diagnosis Result
 * Hasil prediksi AI berdasarkan keluhan & history
 */
export interface AIDiagnosisResult {
  id: string;
  service_id: string; // Link to NotaService
  keluhan_text: string;
  keluhan_tags: string[];
  predicted_damages: PredictedDamage[];
  recommended_spareparts: RecommendedSparepart[];
  estimated_cost_range: {
    min: number;
    max: number;
    average: number;
  };
  confidence_score: number; // 0-1 (based on historical data)
  createdAt: Date;
}

export interface PredictedDamage {
  damage_type: string;
  probability: number; // 0-1
  common_in_model: boolean;
  typical_spareparts: string[];
}

/**
 * BLUEPRINT: Vendor Quality Analysis
 * Real-time vendor performance tracking
 */
export interface VendorQualityReport {
  vendor_id: string;
  vendor_name: string;
  total_products_supplied: number;
  products_used_in_service: number;
  return_rate: number; // Products that caused repeat service
  quality_score: number; // 0-100 composite score
  sparepart_breakdown: {
    brand_sparepart: string;
    quality: string;
    total_supplied: number;
    return_count: number;
    return_rate: number;
  }[];
  performance_trend: 'improving' | 'stable' | 'declining';
  recommendation: 'trusted' | 'monitor' | 'avoid';
  last_updated: Date;
}
