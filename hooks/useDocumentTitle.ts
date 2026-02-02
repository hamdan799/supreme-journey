import { useEffect } from 'react'

export function useDocumentTitle(storeName: string, activeMenu?: string) {
  useEffect(() => {
    const title = storeName?.trim() || 'Sistem Kelola Barang'
    const menuName = activeMenu ? ` - ${formatMenuName(activeMenu)}` : ''
    document.title = `${title}${menuName}`
  }, [storeName, activeMenu])
}

function formatMenuName(menu: string): string {
  const menuMap: Record<string, string> = {
    'dashboard': 'Dashboard',
    'barang': 'Kelola Barang',
    'transaksi': 'Transaksi',
    'hutang-piutang': 'Hutang Piutang',
    'kontak': 'Kontak',
    'laporan': 'Laporan',
    'keuangan': 'Keuangan',
    'analisis': 'Analisis',
    'pengaturan': 'Pengaturan'
  }
  return menuMap[menu] || menu
}
