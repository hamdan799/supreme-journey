// OriginalName: Notification (Settings)
// ShortName: NotifTab

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Switch } from '../ui/switch'
import { Bell, TrendingDown, CreditCard, FileText, BarChart3, BarChart4 } from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

interface NotificationSettings {
  lowStock: boolean
  paymentReminders: boolean
  dailyReport: boolean
  weeklyReport: boolean
  monthlyReport: boolean
}

const defaultSettings: NotificationSettings = {
  lowStock: true,
  paymentReminders: true,
  dailyReport: false,
  weeklyReport: true,
  monthlyReport: true
}

export function NotifTab() {
  useDocumentTitle('Pengaturan Notifikasi')
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('settings_notifications')
      if (saved) {
        setSettings(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error)
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('settings_notifications', JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save notification settings:', error)
      toast.error('Gagal menyimpan pengaturan notifikasi')
    }
  }, [settings])

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: !prev[key] }
      toast.success(`Notifikasi ${!prev[key] ? 'diaktifkan' : 'dinonaktifkan'}`)
      return newSettings
    })
  }

  const notifications = [
    {
      key: 'lowStock' as keyof NotificationSettings,
      icon: TrendingDown,
      label: 'Alert Stock Menipis',
      description: 'Notifikasi saat stock produk di bawah minimum',
      color: 'text-orange-500'
    },
    {
      key: 'paymentReminders' as keyof NotificationSettings,
      icon: CreditCard,
      label: 'Pengingat Pembayaran',
      description: 'Pengingat untuk hutang/piutang jatuh tempo',
      color: 'text-red-500'
    },
    {
      key: 'dailyReport' as keyof NotificationSettings,
      icon: FileText,
      label: 'Laporan Harian',
      description: 'Ringkasan penjualan dan transaksi harian',
      color: 'text-blue-500'
    },
    {
      key: 'weeklyReport' as keyof NotificationSettings,
      icon: BarChart3,
      label: 'Laporan Mingguan',
      description: 'Laporan performa mingguan',
      color: 'text-green-500'
    },
    {
      key: 'monthlyReport' as keyof NotificationSettings,
      icon: BarChart4,
      label: 'Laporan Bulanan',
      description: 'Analisis bulanan dan insight bisnis',
      color: 'text-purple-500'
    }
  ]

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl">Pengaturan Notifikasi</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola notifikasi stok, pembayaran, dan reminder
          </p>
        </div>
      </div>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Pengaturan Notifikasi
        </CardTitle>
        <CardDescription>
          Atur notifikasi untuk berbagai event dalam sistem. Pengaturan akan tersimpan otomatis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notif) => {
          const Icon = notif.icon
          return (
            <div 
              key={notif.key} 
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 mt-0.5 ${notif.color}`} />
                <div>
                  <p className="font-medium">{notif.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {notif.description}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings[notif.key]}
                onCheckedChange={() => handleToggle(notif.key)}
              />
            </div>
          )
        })}
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Catatan:</strong> Pengaturan notifikasi akan tersimpan secara otomatis dan 
            tetap berlaku setelah Anda menutup atau reload aplikasi.
          </p>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
