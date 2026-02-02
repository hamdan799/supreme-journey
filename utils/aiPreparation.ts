/**
 * AI Preparation & Future Integration Layer
 * 
 * This file contains placeholder functions and data structures
 * that will be used for AI integration in the future.
 * 
 * Current Status: MOCK IMPLEMENTATION
 * Future: Connect to OpenAI API / Custom ML Model
 */

import type { Product } from '../types/inventory'

// ============================================
// 1. PRODUCT NAME ANALYSIS (AI-Ready)
// ============================================

export interface ProductNameAnalysis {
  category: string
  brand_hp?: string
  model_hp?: string
  brand_sparepart?: string
  confidence: number
  suggestions: string[]
}

/**
 * Analyze product name and extract information
 * 
 * Example inputs:
 * - "flex tombol power vivo y12" → category: "Flexible", brand: "Vivo", model: "Y12"
 * - "lcd incell samsung a50s" → category: "LCD", brand: "Samsung", model: "A50s", sparepart: "Incell"
 * - "baterai original iphone 11" → category: "Battery", brand: "iPhone", model: "11", sparepart: "Original"
 * 
 * TODO: Replace with actual AI/ML model
 */
export function analyzeProductName(productName: string): ProductNameAnalysis {
  const name = productName.toLowerCase().trim()
  
  // TODO: AI INTEGRATION - Call OpenAI API or Custom ML Model
  // const analysis = await openai.analyze(productName)
  
  // MOCK IMPLEMENTATION - Rule-based parsing
  const result: ProductNameAnalysis = {
    category: 'Lain-lain',
    confidence: 0,
    suggestions: []
  }
  
  // Category detection
  const categoryKeywords = {
    'LCD': ['lcd', 'layar', 'touchscreen', 'touch', 'display', 'screen'],
    'Battery': ['baterai', 'battery', 'batre', 'batere'],
    'Backdoor': ['backdoor', 'back door', 'tutup belakang', 'casing belakang'],
    'Kamera': ['kamera', 'camera', 'cam', 'lensa'],
    'Flexible': ['flex', 'flexible', 'flexi'],
    'IC': ['ic', 'chip'],
    'Konektor': ['konektor', 'connector', 'port'],
    'Kabel': ['kabel', 'cable'],
    'Speaker': ['speaker', 'spiker', 'mesh'],
    'Vibrator': ['vibrator', 'vibrate', 'getar']
  }
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => name.includes(kw))) {
      result.category = category
      result.confidence = 0.8
      break
    }
  }
  
  // Brand HP detection
  const brandKeywords = [
    'xiaomi', 'samsung', 'oppo', 'vivo', 'realme', 'iphone', 'apple',
    'infinix', 'tecno', 'poco', 'asus', 'nokia', 'sony', 'lg', 'huawei',
    'oneplus', 'lenovo', 'motorola', 'zte'
  ]
  
  for (const brand of brandKeywords) {
    if (name.includes(brand)) {
      result.brand_hp = brand.charAt(0).toUpperCase() + brand.slice(1)
      result.confidence = Math.min(result.confidence + 0.1, 1.0)
      break
    }
  }
  
  // Sparepart brand detection
  const sparepartBrands = ['original', 'kw super', 'kw', 'oem', 'aftermarket', 'refurbished', 'incell', 'amoled']
  
  for (const spBrand of sparepartBrands) {
    if (name.includes(spBrand)) {
      result.brand_sparepart = spBrand.charAt(0).toUpperCase() + spBrand.slice(1)
      result.confidence = Math.min(result.confidence + 0.1, 1.0)
      break
    }
  }
  
  // Model extraction (simple pattern matching)
  // TODO: Use AI for better model extraction
  const modelPattern = /[a-z]\d+[a-z]?(\s?pro|\s?plus|\s?lite)?/gi
  const modelMatch = productName.match(modelPattern)
  if (modelMatch) {
    result.model_hp = modelMatch[0].toUpperCase()
    result.suggestions.push(`Model terdeteksi: ${result.model_hp}`)
  }
  
  return result
}

// ============================================
// 2. KELUHAN ANALYSIS & DIAGNOSIS (AI-Ready)
// ============================================

export interface DiagnosisResult {
  damageTypes: string[]
  urgency: 'low' | 'medium' | 'high' | 'critical'
  estimatedCost: {
    min: number
    max: number
  }
  suggestedActions: string[]
  possibleCauses: string[]
  requiredParts: string[]
  estimatedTime: string
  aiConfidence: number
}

/**
 * Analyze keluhan and provide diagnosis
 * 
 * TODO: Replace with AI/ML model for better diagnosis
 */
export function analyzeKeluhan(keluhan: string, detectedTypes: string[]): DiagnosisResult {
  // TODO: AI INTEGRATION - OpenAI GPT-4 Analysis
  // const diagnosis = await openai.diagnose(keluhan)
  
  // MOCK IMPLEMENTATION
  const result: DiagnosisResult = {
    damageTypes: detectedTypes,
    urgency: 'medium',
    estimatedCost: { min: 0, max: 0 },
    suggestedActions: [],
    possibleCauses: [],
    requiredParts: [],
    estimatedTime: '1-2 jam',
    aiConfidence: 0.7
  }
  
  const lowerKeluhan = keluhan.toLowerCase()
  
  // Urgency detection
  if (lowerKeluhan.includes('mati total') || lowerKeluhan.includes('tidak nyala')) {
    result.urgency = 'high'
    result.suggestedActions.push('Cek jalur power')
    result.suggestedActions.push('Cek IC power')
    result.suggestedActions.push('Test dengan power supply')
    result.possibleCauses.push('IC Power rusak')
    result.possibleCauses.push('Short circuit')
    result.possibleCauses.push('Battery connector rusak')
    result.estimatedTime = '2-4 jam'
  }
  
  if (lowerKeluhan.includes('pecah') || lowerKeluhan.includes('layar retak')) {
    result.urgency = 'medium'
    result.requiredParts.push('LCD / Touchscreen')
    result.estimatedCost = { min: 300000, max: 1500000 }
    result.estimatedTime = '30-60 menit'
    result.suggestedActions.push('Ganti LCD')
  }
  
  if (lowerKeluhan.includes('tidak bisa cas') || lowerKeluhan.includes('tidak bisa dicas')) {
    result.urgency = 'medium'
    result.requiredParts.push('Konektor Charging')
    result.possibleCauses.push('Port charging kotor')
    result.possibleCauses.push('Konektor charging rusak')
    result.possibleCauses.push('IC charging rusak')
    result.suggestedActions.push('Bersihkan port charging')
    result.suggestedActions.push('Cek dengan kabel lain')
    result.suggestedActions.push('Ganti konektor charging')
    result.estimatedCost = { min: 50000, max: 200000 }
    result.estimatedTime = '30-90 menit'
  }
  
  if (lowerKeluhan.includes('bootloop') || lowerKeluhan.includes('restart terus')) {
    result.urgency = 'high'
    result.possibleCauses.push('Software corrupt')
    result.possibleCauses.push('eMMC rusak')
    result.possibleCauses.push('IC CPU overheat')
    result.suggestedActions.push('Flash firmware')
    result.suggestedActions.push('Factory reset')
    result.suggestedActions.push('Cek hardware (IC CPU/eMMC)')
    result.estimatedTime = '1-3 jam'
  }
  
  if (lowerKeluhan.includes('baterai') || lowerKeluhan.includes('battery')) {
    result.requiredParts.push('Baterai')
    result.estimatedCost = { min: 80000, max: 400000 }
    result.estimatedTime = '15-30 menit'
    result.suggestedActions.push('Ganti baterai')
  }
  
  if (lowerKeluhan.includes('kamera') || lowerKeluhan.includes('camera')) {
    result.requiredParts.push('Kamera')
    result.possibleCauses.push('Kamera rusak')
    result.possibleCauses.push('Flex kamera rusak')
    result.possibleCauses.push('Software issue')
    result.suggestedActions.push('Cek flexible kamera')
    result.suggestedActions.push('Ganti kamera jika perlu')
    result.estimatedCost = { min: 100000, max: 500000 }
    result.estimatedTime = '30-60 menit'
  }
  
  // FRP/iCloud Lock - Critical
  if (lowerKeluhan.includes('frp') || lowerKeluhan.includes('icloud')) {
    result.urgency = 'critical'
    result.suggestedActions.push('⚠️ Cek status owner HP')
    result.suggestedActions.push('⚠️ Minta bukti kepemilikan')
    result.suggestedActions.push('Unlock via server (jika legal)')
    result.estimatedTime = '1-24 jam'
  }
  
  return result
}

// ============================================
// 3. COST PREDICTION (AI-Ready)
// ============================================

export interface CostPrediction {
  predictedCost: number
  confidence: number
  basedOn: string[]
  range: {
    min: number
    max: number
  }
}

/**
 * Predict cost for a product based on similar products
 * 
 * TODO: Use ML model trained on historical data
 */
export function predictProductCost(
  product: Partial<Product>,
  historicalProducts: Product[]
): CostPrediction {
  // TODO: AI/ML MODEL
  // const prediction = await mlModel.predictCost(product, historicalProducts)
  
  // MOCK IMPLEMENTATION - Simple average
  const similarProducts = historicalProducts.filter(p => 
    p.category === product.category &&
    (product.brand_hp ? p.brand_hp === product.brand_hp : true)
  )
  
  if (similarProducts.length === 0) {
    return {
      predictedCost: 0,
      confidence: 0,
      basedOn: [],
      range: { min: 0, max: 0 }
    }
  }
  
  const costs = similarProducts.map(p => p.cost)
  const avgCost = costs.reduce((sum, c) => sum + c, 0) / costs.length
  const minCost = Math.min(...costs)
  const maxCost = Math.max(...costs)
  
  return {
    predictedCost: Math.round(avgCost),
    confidence: Math.min(similarProducts.length / 10, 1.0), // More data = higher confidence
    basedOn: similarProducts.slice(0, 3).map(p => p.name),
    range: {
      min: Math.round(minCost),
      max: Math.round(maxCost)
    }
  }
}

// ============================================
// 4. SMART PRICE SUGGESTION (AI-Ready)
// ============================================

export interface PriceSuggestion {
  suggestedPrice: number
  minPrice: number
  maxPrice: number
  margin: number
  reasoning: string[]
}

/**
 * Suggest selling price based on cost and market data
 * 
 * TODO: Use AI to analyze market trends and competitor pricing
 */
export function suggestSellingPrice(
  cost: number,
  category: string,
  brand?: string
): PriceSuggestion {
  // TODO: AI INTEGRATION - Market analysis
  // const suggestion = await ai.analyzePricing(cost, category, brand)
  
  // MOCK IMPLEMENTATION - Rule-based margin
  let marginPercent = 30 // Default 30%
  
  // Category-based margin
  if (category === 'LCD') marginPercent = 40
  if (category === 'Battery') marginPercent = 35
  if (category === 'Service') marginPercent = 100 // Service fee
  if (category === 'Alat & Bahan') marginPercent = 20
  
  // Brand-based adjustment
  if (brand === 'Original') marginPercent += 10
  if (brand === 'KW') marginPercent += 5
  
  const suggestedPrice = Math.round(cost * (1 + marginPercent / 100))
  const minPrice = Math.round(cost * 1.15) // Min 15% profit
  const maxPrice = Math.round(cost * 2) // Max 100% profit
  
  return {
    suggestedPrice,
    minPrice,
    maxPrice,
    margin: marginPercent,
    reasoning: [
      `Margin ${marginPercent}% untuk kategori ${category}`,
      brand ? `Adjustment untuk brand ${brand}` : '',
      `Harga minimum untuk profit 15%: Rp ${minPrice.toLocaleString('id-ID')}`,
      `Harga maksimum (2x modal): Rp ${maxPrice.toLocaleString('id-ID')}`
    ].filter(Boolean)
  }
}

// ============================================
// 5. VENDOR RECOMMENDATION (AI-Ready)
// ============================================

export interface VendorRecommendation {
  vendorId: string
  vendorName: string
  score: number
  reasons: string[]
}

/**
 * Recommend best vendor for a product
 * 
 * TODO: Use AI to analyze vendor history, quality, price, delivery time
 */
export function recommendVendor(
  category: string,
  brand?: string,
  historicalData?: any[]
): VendorRecommendation[] {
  // TODO: AI/ML MODEL
  // const recommendations = await mlModel.recommendVendor(...)
  
  // MOCK IMPLEMENTATION
  return []
}

// ============================================
// 6. DAMAGE PATTERN DETECTION (AI-Ready)
// ============================================

/**
 * Detect repeat patterns in customer service history
 * 
 * Example:
 * - Customer X has 3 services in 2 months (all LCD issues)
 * - AI suggests: "Kemungkinan masalah recurring, cek case HP atau cara pemakaian"
 * 
 * TODO: ML model to detect patterns
 */
export function detectServicePattern(customerHistory: any[]): {
  isRepeatCustomer: boolean
  pattern: string
  suggestion: string
  riskLevel: 'low' | 'medium' | 'high'
} {
  // TODO: AI PATTERN RECOGNITION
  
  // MOCK IMPLEMENTATION
  if (customerHistory.length <= 1) {
    return {
      isRepeatCustomer: false,
      pattern: 'First time customer',
      suggestion: 'Pelanggan baru, berikan service terbaik',
      riskLevel: 'low'
    }
  }
  
  return {
    isRepeatCustomer: true,
    pattern: 'Multiple services detected',
    suggestion: 'Cek riwayat service sebelumnya',
    riskLevel: 'medium'
  }
}

// ============================================
// 7. INVENTORY OPTIMIZATION (AI-Ready)
// ============================================

/**
 * AI-powered inventory suggestions
 * 
 * TODO: ML model to predict stock needs based on:
 * - Historical sales
 * - Seasonal trends
 * - Market demand
 */
export function optimizeInventory(historicalSales: any[]): {
  restockSuggestions: Array<{
    productId: string
    productName: string
    currentStock: number
    suggestedRestock: number
    reason: string
  }>
  slowMovingItems: string[]
  fastMovingItems: string[]
} {
  // TODO: AI/ML OPTIMIZATION
  
  return {
    restockSuggestions: [],
    slowMovingItems: [],
    fastMovingItems: []
  }
}

// ============================================
// EXPORT ALL AI FUNCTIONS
// ============================================

export const AI = {
  // Product Analysis
  analyzeProductName,
  predictCost: predictProductCost,
  suggestPrice: suggestSellingPrice,
  
  // Service & Diagnosis
  analyzeKeluhan,
  detectPattern: detectServicePattern,
  
  // Vendor & Supply Chain
  recommendVendor,
  
  // Inventory
  optimizeInventory
}

export default AI
