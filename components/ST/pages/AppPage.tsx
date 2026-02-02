import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Label } from '../../ui/label'
import { Switch } from '../../ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Separator } from '../../ui/separator'
import { Palette, Type, Monitor, Globe } from 'lucide-react'

interface AppPageProps {
  isDarkMode: boolean
  onThemeChange: (isDark: boolean) => void
}

export default function AppPage({ isDarkMode, onThemeChange }: AppPageProps) {
  useDocumentTitle('Tampilan Aplikasi')

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tampilan Aplikasi</h1>
        <p className="text-muted-foreground">
          Sesuaikan tema dan antarmuka aplikasi
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            <CardTitle>Preferensi Tampilan</CardTitle>
          </div>
          <CardDescription>Kustomisasi visual sesuai kenyamanan Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Mode Gelap</Label>
              <p className="text-sm text-muted-foreground">
                Aktifkan tema gelap untuk mengurangi kelelahan mata
              </p>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={onThemeChange}
            />
          </div>
          
          <Separator />

          {/* Font Size */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-muted-foreground" />
                <Label className="text-base">Ukuran Font</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Sesuaikan ukuran teks antarmuka
              </p>
            </div>
            <Select defaultValue="normal">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih ukuran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Kecil</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="large">Besar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Compact Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
               <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-muted-foreground" />
                <Label className="text-base">Mode Kompak</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Tampilan lebih padat untuk efisiensi layar
              </p>
            </div>
            <Switch id="compact-mode" />
          </div>

          <Separator />

          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <Label className="text-base">Bahasa</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Bahasa utama aplikasi
              </p>
            </div>
            <Select defaultValue="id">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih bahasa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Indonesia</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </CardContent>
      </Card>

      <p className="text-sm text-center text-muted-foreground">
        💡 Pengaturan tampilan akan tersimpan otomatis.
      </p>
    </div>
  )
}
