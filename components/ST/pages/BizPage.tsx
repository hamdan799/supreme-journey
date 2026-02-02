import { useState } from 'react'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Separator } from '../../ui/separator'
import { Shield, Upload, Store } from 'lucide-react'
import { toast } from 'sonner'

interface BizPageProps {
  storeInfo: {
    storeName: string
    storeAddress: string
    storePhone: string
    currency: string
    storeLogo: string
  }
  onStoreInfoUpdate: (info: any) => void
}

export default function BizPage({ storeInfo, onStoreInfoUpdate }: BizPageProps) {
  useDocumentTitle('Profil Bisnis')

  const [formData, setFormData] = useState(storeInfo)
  const [isDirty, setIsDirty] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
  }

  const handleSave = () => {
    onStoreInfoUpdate(formData)
    setIsDirty(false)
    toast.success('Profil bisnis berhasil diperbarui')
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 2MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        handleChange('storeLogo', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profil Bisnis</h1>
        <p className="text-muted-foreground">
          Kelola informasi dasar bisnis dan keamanan sistem
        </p>
      </div>

      {/* Section 1: Informasi Bisnis */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Bisnis</CardTitle>
          <CardDescription>Identitas toko yang akan tampil di nota dan laporan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Upload */}
          <div className="flex flex-col items-center sm:items-start gap-4">
            <Label>Logo Bisnis</Label>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden relative group">
                {formData.storeLogo ? (
                  <img 
                    src={formData.storeLogo} 
                    alt="Store Logo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="w-10 h-10 text-muted-foreground" />
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Label htmlFor="logo-upload" className="cursor-pointer text-white text-xs flex flex-col items-center gap-1">
                     <Upload className="w-4 h-4" />
                     Ubah
                   </Label>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Input 
                  id="logo-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleLogoUpload}
                />
                <Button variant="outline" size="sm" onClick={() => document.getElementById('logo-upload')?.click()}>
                  Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground">
                  Rekomendasi: 200x200px PNG/JPG max 2MB
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="storeName">Nama Toko</Label>
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                placeholder="Nama Toko Anda"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storePhone">Nomor Kontak</Label>
              <Input
                id="storePhone"
                value={formData.storePhone}
                onChange={(e) => handleChange('storePhone', e.target.value)}
                placeholder="08xx xxxx xxxx"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeAddress">Alamat</Label>
            <Textarea
              id="storeAddress"
              value={formData.storeAddress}
              onChange={(e) => handleChange('storeAddress', e.target.value)}
              placeholder="Alamat lengkap toko..."
              rows={3}
            />
          </div>

          <div className="space-y-2 max-w-[200px]">
            <Label>Mata Uang</Label>
            <Select 
              value={formData.currency} 
              onValueChange={(val) => handleChange('currency', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Mata Uang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IDR">IDR (Rupiah)</SelectItem>
                <SelectItem value="USD">USD (Dollar)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button onClick={handleSave} disabled={!isDirty}>
              Simpan Perubahan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Section 2: Keamanan Sistem */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <CardTitle>Keamanan Sistem</CardTitle>
          </div>
          <CardDescription>Atur akses dan mode penggunaan sistem</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
            <div className="space-y-1">
              <h3 className="font-medium">Password Switch Role</h3>
              <p className="text-sm text-muted-foreground">
                Digunakan untuk berpindah antara mode Owner dan Kasir
              </p>
              <p className="text-xs font-medium text-amber-600 mt-1">
                Status: Belum diatur (default: 1234)
              </p>
            </div>
            <Button variant="outline">
              Atur / Ubah Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
