// OriginalName: Business (Settings)
// ShortName: BizTab

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Separator } from '../ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import {
  Store,
  Edit,
  Save,
  Lock,
  Eye,
  EyeOff,
  Key,
  Shield
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

interface BizTabProps {
  storeInfo: {
    storeName: string
    storeLogo: string
    storeAddress: string
    storePhone: string
    currency: string
  }
  onStoreInfoUpdate: (info: any) => void
}

export function BizTab({ storeInfo, onStoreInfoUpdate }: BizTabProps) {
  useDocumentTitle('Pengaturan Bisnis')
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState(storeInfo)
  const [isUploading, setIsUploading] = useState(false)

  // Switch Role Password State
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [switchPassword, setSwitchPassword] = useState('')
  const [confirmSwitchPassword, setConfirmSwitchPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Load current password on mount
  useEffect(() => {
    try {
      const savedPassword = localStorage.getItem('switch_role_password')
      if (savedPassword) {
        setCurrentPassword('****') // Display only
      } else {
        setCurrentPassword('Belum diatur (default: 1234)')
      }
    } catch (error) {
      console.error('Failed to load password:', error)
    }
  }, [])

  // Update form when props change
  useEffect(() => {
    setFormData(storeInfo)
  }, [storeInfo])

  const handleSaveBusinessProfile = () => {
    // Validation
    if (!formData.storeName || formData.storeName.trim() === '') {
      toast.error('Nama bisnis harus diisi')
      return
    }

    if (formData.storePhone && !/^[0-9+\-\s()]+$/.test(formData.storePhone)) {
      toast.error('Format nomor telepon tidak valid')
      return
    }

    try {
      onStoreInfoUpdate(formData)
      setEditMode(false)
      toast.success('Profil bisnis berhasil diperbarui')
    } catch (error) {
      console.error('Failed to save business profile:', error)
      toast.error('Gagal menyimpan profil bisnis')
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar')
      return
    }

    setIsUploading(true)

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, storeLogo: reader.result as string })
        setIsUploading(false)
        toast.success('Logo berhasil diupload')
      }
      reader.onerror = () => {
        setIsUploading(false)
        toast.error('Gagal membaca file')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setIsUploading(false)
      toast.error('Gagal mengupload logo')
    }
  }

  const handleSavePassword = () => {
    if (!switchPassword || switchPassword.length < 4) {
      toast.error('Password minimal 4 karakter')
      return
    }
    if (switchPassword !== confirmSwitchPassword) {
      toast.error('Password tidak cocok')
      return
    }

    try {
      localStorage.setItem('switch_role_password', switchPassword)
      setCurrentPassword('****')
      toast.success('Password berhasil diatur')
      setShowPasswordDialog(false)
      setSwitchPassword('')
      setConfirmSwitchPassword('')
      setShowPassword(false)
      setShowConfirmPassword(false)
    } catch (error) {
      console.error('Failed to save password:', error)
      toast.error('Gagal menyimpan password')
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl">Pengaturan Bisnis</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola informasi profil toko dan bisnis Anda
          </p>
        </div>
      </div>

    <div className="space-y-6">
      {/* Business Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profil Bisnis</CardTitle>
          <CardDescription>
            Informasi dasar tentang bisnis Anda yang akan ditampilkan di struk dan laporan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo */}
          <div className="space-y-2">
            <Label>Logo Bisnis</Label>
            <div className="flex items-center gap-4">
              {formData.storeLogo ? (
                <img
                  src={formData.storeLogo}
                  alt="Logo"
                  className="w-24 h-24 rounded-lg object-cover border"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg border flex items-center justify-center bg-muted">
                  <Store className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="space-y-2">
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={!editMode || isUploading}
                  className="max-w-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Rekomendasi: 200x200px, format PNG/JPG, max 2MB
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Business Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Bisnis *</Label>
              <Input
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                disabled={!editMode}
                placeholder="Nama Toko/Bisnis Anda"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Nomor Telepon</Label>
              <Input
                value={formData.storePhone}
                onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })}
                disabled={!editMode}
                placeholder="08xx xxxx xxxx"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Alamat</Label>
              <Textarea
                value={formData.storeAddress}
                onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
                disabled={!editMode}
                placeholder="Alamat lengkap bisnis Anda"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Mata Uang</Label>
              <Select
                value={formData.currency}
                onValueChange={(v) => setFormData({ ...formData, currency: v })}
                disabled={!editMode}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IDR">IDR (Rupiah)</SelectItem>
                  <SelectItem value="USD">USD (Dollar)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            {!editMode ? (
              <Button onClick={() => setEditMode(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profil
              </Button>
            ) : (
              <>
                <Button onClick={handleSaveBusinessProfile}>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </Button>
                <Button variant="outline" onClick={() => {
                  setFormData(storeInfo)
                  setEditMode(false)
                }}>
                  Batal
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security - Switch Role Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Keamanan
          </CardTitle>
          <CardDescription>
            Atur password untuk fitur keamanan sistem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <p className="font-medium">Password Switch Role</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Digunakan untuk berpindah antara mode Owner dan Kasir
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Status: <span className="font-medium">{currentPassword}</span>
              </p>
            </div>
            <Button onClick={() => setShowPasswordDialog(true)}>
              <Key className="w-4 h-4 mr-2" />
              Atur Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Switch Role Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Atur Password Switch Role
            </DialogTitle>
            <DialogDescription>
              Password ini digunakan untuk berpindah antara mode Owner dan Kasir di App Header.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Password Baru *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={switchPassword}
                  onChange={(e) => setSwitchPassword(e.target.value)}
                  placeholder="Masukkan password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Konfirmasi Password *</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmSwitchPassword}
                  onChange={(e) => setConfirmSwitchPassword(e.target.value)}
                  placeholder="Ketik ulang password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            {switchPassword && confirmSwitchPassword && switchPassword !== confirmSwitchPassword && (
              <p className="text-sm text-destructive">
                Password tidak cocok
              </p>
            )}
            <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Tips:</strong> Gunakan password yang mudah diingat tapi tetap aman. 
                Password ini akan digunakan setiap kali Anda ingin berpindah role.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowPasswordDialog(false)
                setSwitchPassword('')
                setConfirmSwitchPassword('')
                setShowPassword(false)
                setShowConfirmPassword(false)
              }}
            >
              Batal
            </Button>
            <Button 
              onClick={handleSavePassword}
              disabled={!switchPassword || !confirmSwitchPassword || switchPassword !== confirmSwitchPassword}
            >
              <Save className="w-4 h-4 mr-2" />
              Simpan Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  )
}
