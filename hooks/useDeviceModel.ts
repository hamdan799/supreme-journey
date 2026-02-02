// OriginalName: useDeviceModelManagement
// ShortName: useDeviceModel

import { useState, useEffect } from 'react';
import type { PhoneModel } from '../types/inventory';

const STORAGE_KEY = 'device-model-data';

export interface DeviceModelExtended {
  id: string;
  brand: string; // Brand HP
  model: string; // Model HP
  series?: string; // Nama seri (Galaxy A Series)
  releaseYear?: number; // Tahun rilis
  modelCode?: string; // Kode model (SM-A057F)
  technicalNotes?: string; // Catatan teknis
  
  // Variasi
  variants?: {
    ram?: string[];
    rom?: string[];
    colors?: string[];
    region?: ('Global' | 'India' | 'China')[];
  };
  
  // Kerusakan Umum (AI learned data)
  commonDamages?: {
    type: string;
    frequency: number; // 0-100
  }[];
  
  commonSpareparts?: {
    productId: string;
    productName: string;
    frequency: number; // berapa kali dipakai
  }[];
  
  // Kompatibilitas sparepart
  compatibleWith?: string[]; // Array of model IDs yang sparepart-nya kompatibel
  
  // Metadata
  created_from_product_id?: string;
  created_from_service_id?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useDeviceModel() {
  const [models, setModels] = useState<DeviceModelExtended[]>([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setModels(parsed);
      } catch (error) {
        console.error('Failed to parse device model data:', error);
        setModels([]);
      }
    }
  }, []);

  // Save to localStorage
  const saveModels = (newModels: DeviceModelExtended[]) => {
    setModels(newModels);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newModels));
  };

  // Add model
  const addModel = (data: Partial<DeviceModelExtended>) => {
    const newModel: DeviceModelExtended = {
      id: `model-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      brand: data.brand || '',
      model: data.model || '',
      series: data.series,
      releaseYear: data.releaseYear,
      modelCode: data.modelCode,
      technicalNotes: data.technicalNotes,
      variants: data.variants,
      commonDamages: data.commonDamages || [],
      commonSpareparts: data.commonSpareparts || [],
      compatibleWith: data.compatibleWith || [],
      created_from_product_id: data.created_from_product_id,
      created_from_service_id: data.created_from_service_id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    saveModels([...models, newModel]);
    return newModel;
  };

  // Update model
  const updateModel = (id: string, data: Partial<DeviceModelExtended>) => {
    const updated = models.map((m) =>
      m.id === id
        ? {
            ...m,
            ...data,
            updatedAt: new Date(),
          }
        : m
    );
    saveModels(updated);
  };

  // Delete model
  const deleteModel = (id: string) => {
    const filtered = models.filter((m) => m.id !== id);
    saveModels(filtered);
  };

  // Check if model is used in products
  const isModelUsed = (brand: string, model: string): boolean => {
    const products = localStorage.getItem('inventory_products');
    if (!products) return false;
    
    try {
      const parsed = JSON.parse(products);
      return parsed.some((p: any) => p.brand_hp === brand && p.model_hp === model);
    } catch {
      return false;
    }
  };

  // Check if model is used in notas
  const isModelUsedInNotas = (brand: string, model: string): boolean => {
    const notas = localStorage.getItem('nota-storage');
    if (!notas) return false;
    
    try {
      const parsed = JSON.parse(notas);
      return parsed.some((n: any) => 
        (n.merk === brand || n.brand_hp === brand) && n.model_hp === model
      );
    } catch {
      return false;
    }
  };

  // Auto-record from product or service
  const autoRecordFromProduct = (productId: string, brand: string, model: string) => {
    // Check if model already exists
    const exists = models.find(m => m.brand === brand && m.model === model);
    if (!exists) {
      addModel({
        brand,
        model,
        created_from_product_id: productId,
      });
    }
  };

  const autoRecordFromService = (serviceId: string, brand: string, model: string) => {
    // Check if model already exists
    const exists = models.find(m => m.brand === brand && m.model === model);
    if (!exists) {
      addModel({
        brand,
        model,
        created_from_service_id: serviceId,
      });
    }
  };

  // Get models by brand
  const getModelsByBrand = (brand: string) => {
    return models.filter(m => m.brand === brand);
  };

  // Get most common damages for a model
  const getMostCommonDamages = (brand: string, model: string) => {
    const deviceModel = models.find(m => m.brand === brand && m.model === model);
    if (!deviceModel || !deviceModel.commonDamages) return [];
    
    return deviceModel.commonDamages.sort((a, b) => b.frequency - a.frequency).slice(0, 5);
  };

  // Get most used spareparts for a model
  const getMostUsedSpareparts = (brand: string, model: string) => {
    const deviceModel = models.find(m => m.brand === brand && m.model === model);
    if (!deviceModel || !deviceModel.commonSpareparts) return [];
    
    return deviceModel.commonSpareparts.sort((a, b) => b.frequency - a.frequency).slice(0, 5);
  };

  return {
    models,
    addModel,
    updateModel,
    deleteModel,
    isModelUsed,
    isModelUsedInNotas,
    autoRecordFromProduct,
    autoRecordFromService,
    getModelsByBrand,
    getMostCommonDamages,
    getMostUsedSpareparts,
  };
}
