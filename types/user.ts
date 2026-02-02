// User Management Types

export type UserRole = 'owner' | 'kasir'

export interface User {
  id: string
  name: string
  email?: string
  role: UserRole
  password: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface UserPermissions {
  canAccessDashboard: boolean
  canAccessProducts: boolean
  canAccessTransactions: boolean
  canAccessDebts: boolean
  canAccessContacts: boolean
  canAccessReports: boolean
  canAccessFinancial: boolean
  canAccessAnalysis: boolean
  canAccessSettings: boolean
  canAccessNota: boolean
  canDeleteProducts: boolean
  canDeleteCategories: boolean
  canDeleteTransactions: boolean
  canEditPrices: boolean
  canManageUsers: boolean
  canViewFinancialReports: boolean
}

export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  owner: {
    canAccessDashboard: true,
    canAccessProducts: true,
    canAccessTransactions: true,
    canAccessDebts: true,
    canAccessContacts: true,
    canAccessReports: true,
    canAccessFinancial: true,
    canAccessAnalysis: true,
    canAccessSettings: true,
    canAccessNota: true,
    canDeleteProducts: true,
    canDeleteCategories: true,
    canDeleteTransactions: true,
    canEditPrices: true,
    canManageUsers: true,
    canViewFinancialReports: true,
  },
  kasir: {
    canAccessDashboard: true, // View only
    canAccessProducts: true, // View & update stock only
    canAccessTransactions: true, // Create sales only
    canAccessDebts: false,
    canAccessContacts: true, // View only
    canAccessReports: true, // Limited - sales report only
    canAccessFinancial: false,
    canAccessAnalysis: false,
    canAccessSettings: false,
    canAccessNota: true, // Create & view
    canDeleteProducts: false,
    canDeleteCategories: false,
    canDeleteTransactions: false,
    canEditPrices: false, // Kasir tidak bisa ubah harga
    canManageUsers: false,
    canViewFinancialReports: false,
  },
}

export function getUserPermissions(role: UserRole): UserPermissions {
  return ROLE_PERMISSIONS[role]
}

export function canAccessMenu(role: UserRole, menu: string): boolean {
  const permissions = getUserPermissions(role)
  
  switch (menu) {
    // Dashboard
    case 'dashboard':
      return permissions.canAccessDashboard
    
    // Barang & Stok Group
    case 'barang-stok':
    case 'barang':
    case 'kategori':
    case 'kelola-stok':
    case 'brand-sparepart':
      return permissions.canAccessProducts
    case 'laporan':
      return permissions.canAccessReports
    
    // Master Group
    case 'master':
    case 'master-hp':
    case 'brand-hp':
    case 'master-kerusakan':
    case 'device-model':
      return permissions.canAccessProducts
    
    // Transaksi Group
    case 'transaksi-group':
    case 'pos':
    case 'transaksi':
      return permissions.canAccessTransactions
    
    // Hutang Piutang
    case 'hutang-piutang':
      return permissions.canAccessDebts
    
    // Kontak & Vendor Group
    case 'kontak-group':
    case 'kontak':
    case 'kontak-pelanggan':
    case 'kontak-supplier':
    case 'kontak-vendor':
      return permissions.canAccessContacts
    
    // Nota / Service Group
    case 'nota-group':
    case 'nota':
    case 'nota-pesanan':
    case 'nota-riwayat':
      return permissions.canAccessNota
    
    // Keuangan Group
    case 'keuangan-group':
    case 'keuangan':
      return permissions.canAccessFinancial
    
    // Analitik Group
    case 'analitik':
    case 'analisis':
    case 'analitik-keuangan':
    case 'analitik-penjualan':
    case 'analitik-inventory':
    case 'analitik-repair-ai':
      return permissions.canAccessAnalysis
    
    // Dokumen Group
    case 'dokumen-group':
    case 'dokumen':
    case 'dokumen-builder':
    case 'dokumen-export':
    case 'dokumen-advanced':
      return permissions.canAccessReports
    
    // Pengaturan Group
    case 'pengaturan-group':
    case 'pengaturan':
    case 'pengaturan-bisnis':
    case 'pengaturan-pengguna':
    case 'pengaturan-dokumen':
    case 'pengaturan-backup':
    case 'pengaturan-notifikasi':
    case 'pengaturan-tampilan':
    case 'pengaturan-otomasi':
      return permissions.canAccessSettings
    
    default:
      return false
  }
}