// OriginalName: Application (Settings)
// ShortName: AppTab

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Switch } from '../ui/switch'
import { Palette, Moon, Sun } from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

interface AppTabProps {
  isDarkMode: boolean
  onThemeChange: (isDark: boolean) => void
}

export function AppTab({ isDarkMode, onThemeChange }: AppTabProps) {
  useDocumentTitle('Pengaturan Tampilan')
  const handleThemeToggle = (checked: boolean) => {
    onThemeChange(checked)
    toast.success(`Mode ${checked ? 'gelap' : 'terang'} diaktifkan`)
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl">Pengaturan Tampilan</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola tema, warna, dan tampilan aplikasi
          </p>
        </div>
      </div>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Tampilan
        </CardTitle>
        <CardDescription>
          Sesuaikan tampilan aplikasi sesuai preferensi Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-start gap-3">
            {isDarkMode ? (
              <Moon className="w-5 h-5 mt-0.5 text-blue-500" />
            ) : (
              <Sun className="w-5 h-5 mt-0.5 text-amber-500" />
            )}
            <div>
              <p className="font-medium">Mode Gelap</p>
              <p className="text-sm text-muted-foreground">
                Aktifkan tema gelap untuk mengurangi kelelahan mata
              </p>
            </div>
          </div>
          <Switch checked={isDarkMode} onCheckedChange={handleThemeToggle} />
        </div>

        {/* Future appearance options can be added here */}
        <div className="p-4 bg-muted/50 border rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tips:</strong> Mode gelap sangat berguna saat bekerja di malam hari 
            atau dalam kondisi cahaya redup. Pengaturan ini akan tersimpan otomatis.
          </p>
        </div>

        {/* Placeholder for future features */}
        <div className="space-y-3 opacity-50 pointer-events-none">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Ukuran Font</p>
              <p className="text-sm text-muted-foreground">
                Sesuaikan ukuran teks aplikasi
              </p>
            </div>
            <Switch disabled />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Mode Kompak</p>
              <p className="text-sm text-muted-foreground">
                Tampilan lebih padat untuk efisiensi layar
              </p>
            </div>
            <Switch disabled />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Bahasa</p>
              <p className="text-sm text-muted-foreground">
                Pilih bahasa interface aplikasi
              </p>
            </div>
            <Switch disabled />
          </div>
          <p className="text-xs text-center text-muted-foreground mt-4">
            Fitur-fitur di atas akan tersedia di versi mendatang
          </p>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
