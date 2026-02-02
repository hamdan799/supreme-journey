// OriginalName: useBrandHPManagement
// ShortName: useBrandHP

/**
 * 🔷 BLUEPRINT: MASTER BRAND HP
 * 
 * Brand HP adalah MASTER PASIF:
 * - TIDAK punya stok
 * - TIDAK punya ledger
 * - DIPAKAI oleh Device Model (nanti)
 * - DIPAKAI oleh Service flow
 * - DIPAKAI oleh Kompatibilitas Sparepart
 * 
 * ATURAN:
 * - TIDAK BOLEH DELETE (hanya soft-disable via is_active)
 * - Slug auto-generated dari name
 * - Name harus unique (case-insensitive)
 */

import { useState, useEffect } from 'react';
import type { PhoneBrand } from '../types/inventory';

const STORAGE_KEY = 'brand-hp-data';

// 🔷 BLUEPRINT: Helper to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove duplicate hyphens
}

export function useBrandHP() {
  const [brands, setBrands] = useState<PhoneBrand[]>([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // 🔷 BLUEPRINT: Normalize data (backward compatibility)
        const normalized = parsed.map((b: any) => ({
          id: b.id,
          name: b.name,
          slug: b.slug || generateSlug(b.name),
          is_active: b.is_active !== undefined ? b.is_active : !b.archived, // Inverted logic
          notes: b.notes || undefined,
          createdAt: new Date(b.createdAt || Date.now()),
          updatedAt: new Date(b.updatedAt || b.createdAt || Date.now()),
        }));
        setBrands(normalized);
      } catch (error) {
        console.error('Failed to parse brand HP data:', error);
        setBrands([]);
      }
    }
  }, []);

  // Save to localStorage
  const saveBrands = (newBrands: PhoneBrand[]) => {
    setBrands(newBrands);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBrands));
  };

  // 🔷 BLUEPRINT: Check duplicate name (case-insensitive)
  const isDuplicate = (name: string, excludeId?: string): boolean => {
    const trimmedName = name.trim().toLowerCase();
    return brands.some(
      (b) => b.name.toLowerCase() === trimmedName && b.id !== excludeId
    );
  };

  // Add brand
  const addBrand = (name: string, notes?: string) => {
    const trimmedName = name.trim();
    
    // 🔷 BLUEPRINT: Validasi
    if (!trimmedName) {
      throw new Error('Nama brand tidak boleh kosong');
    }
    
    if (isDuplicate(trimmedName)) {
      throw new Error(`Brand "${trimmedName}" sudah ada`);
    }

    const newBrand: PhoneBrand = {
      id: `brand-hp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: trimmedName,
      slug: generateSlug(trimmedName),
      is_active: true,
      notes: notes?.trim() || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    saveBrands([...brands, newBrand]);
    return newBrand;
  };

  // 🔷 BLUEPRINT: Atomic update brand (data + status)
  const updateBrand = (id: string, data: { name: string; notes?: string; is_active?: boolean }) => {
    const trimmedName = data.name.trim();
    
    // 🔷 BLUEPRINT: Validasi
    if (!trimmedName) {
      throw new Error('Nama brand tidak boleh kosong');
    }
    
    if (isDuplicate(trimmedName, id)) {
      throw new Error(`Brand "${trimmedName}" sudah ada`);
    }

    const updated = brands.map((b) =>
      b.id === id
        ? {
            ...b,
            name: trimmedName,
            slug: generateSlug(trimmedName),
            notes: data.notes?.trim() || undefined,
            is_active: data.is_active !== undefined ? data.is_active : b.is_active,
            updatedAt: new Date(),
          }
        : b
    );
    saveBrands(updated);
  };

  // 🔷 BLUEPRINT: Toggle active status (soft-disable)
  const toggleActive = (id: string) => {
    const updated = brands.map((b) =>
      b.id === id ? { ...b, is_active: !b.is_active, updatedAt: new Date() } : b
    );
    saveBrands(updated);
  };

  // 🔷 BLUEPRINT: Activate brand
  const activateBrand = (id: string) => {
    const updated = brands.map((b) =>
      b.id === id ? { ...b, is_active: true, updatedAt: new Date() } : b
    );
    saveBrands(updated);
  };

  // 🔷 BLUEPRINT: Deactivate brand (soft-disable)
  const deactivateBrand = (id: string) => {
    const updated = brands.map((b) =>
      b.id === id ? { ...b, is_active: false, updatedAt: new Date() } : b
    );
    saveBrands(updated);
  };

  // Check if brand is used in products
  const isBrandUsed = (brandName: string): boolean => {
    const products = localStorage.getItem('inventory-products');
    if (!products) return false;
    
    try {
      const parsed = JSON.parse(products);
      return parsed.some((p: any) => p.brand_hp === brandName);
    } catch {
      return false;
    }
  };

  // Check if brand is used in notas
  const isBrandUsedInNotas = (brandName: string): boolean => {
    const notas = localStorage.getItem('nota-storage');
    if (!notas) return false;
    
    try {
      const parsed = JSON.parse(notas);
      return parsed.some((n: any) => n.merk === brandName || n.brand_hp === brandName);
    } catch {
      return false;
    }
  };

  // 🔷 BLUEPRINT: Check if brand is used in Device Models (for future)
  const isBrandUsedInModels = (brandId: string): boolean => {
    // TODO: Implement when Device Model exists
    // const models = localStorage.getItem('device-models');
    // if (!models) return false;
    // try {
    //   const parsed = JSON.parse(models);
    //   return parsed.some((m: any) => m.brand_id === brandId);
    // } catch {
    //   return false;
    // }
    return false; // Placeholder
  };

  // 🔷 BLUEPRINT: Get usage info (BUKAN canDelete, karena Brand HP TIDAK PERNAH DIDELETE)
  const getUsageInfo = (brand: PhoneBrand): { isUsed: boolean; usedIn: string[] } => {
    const usedIn: string[] = [];

    if (isBrandUsed(brand.name)) {
      usedIn.push('product');
    }

    if (isBrandUsedInNotas(brand.name)) {
      usedIn.push('service');
    }

    if (isBrandUsedInModels(brand.id)) {
      usedIn.push('device_model');
    }

    return {
      isUsed: usedIn.length > 0,
      usedIn,
    };
  };

  // Get active brands (not disabled)
  const activeBrands = brands.filter((b) => b.is_active);

  // Get inactive brands
  const inactiveBrands = brands.filter((b) => !b.is_active);

  // 🔷 BLUEPRINT: Statistics
  const stats = {
    total: brands.length,
    active: activeBrands.length,
    inactive: inactiveBrands.length,
    used: brands.filter(b => isBrandUsed(b.name) || isBrandUsedInNotas(b.name)).length,
  };

  return {
    brands,
    activeBrands,
    inactiveBrands,
    stats,
    addBrand,
    updateBrand,
    toggleActive,
    activateBrand,
    deactivateBrand,
    getUsageInfo,
    isBrandUsed,
    isBrandUsedInNotas,
    isBrandUsedInModels,
    isDuplicate,
    
    // 🔷 DEPRECATED: Backward compatibility
    canDelete: getUsageInfo, // Alias for backward compat, but conceptually wrong
    archiveBrand: deactivateBrand,
    unarchiveBrand: activateBrand,
    archivedBrands: inactiveBrands,
  };
}