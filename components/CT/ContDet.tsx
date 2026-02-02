// OriginalName: ContactDetail
// ShortName: ContDet

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  Clock,
  FileText
} from 'lucide-react';
import { useNotaStore } from '../../hooks/useNotaStore';
import type { Contact } from '../../types/inventory';
import type { NotaService } from '../../types/nota';

interface ContDetProps {
  contact: Contact;
  onBack: () => void;
  onEdit: (contact: Contact) => void;
}

export function ContDet({ contact, onBack, onEdit }: ContDetProps) {
  const [activeTab, setActiveTab] = useState('info');
  const { getServiceNota } = useNotaStore();
  
  // Get all notas for this contact
  const allServiceNotas = getServiceNota();
  const contactServiceNotas = allServiceNotas.filter(
    nota => nota.nomorHp === contact.phone || nota.namaPelanggan === contact.name
  );
  
  // TODO: Get Nota Pesanan when available
  const contactPesananNotas: any[] = [];
  
  // Calculate stats
  const totalService = contactServiceNotas.length;
  const totalPesanan = contactPesananNotas.length;
  const totalNota = totalService + totalPesanan;
  
  // Get last activity
  const lastActivity = contactServiceNotas.length > 0
    ? new Date(Math.max(...contactServiceNotas.map(n => new Date(n.tanggal).getTime())))
    : null;
  
  // ============================================================
  // RINGKASAN SERVICE - TEXT ONLY AGGREGATION (BLUEPRINT)
  // ============================================================
  
  interface DeviceServiceSummary {
    deviceKey: string;
    brand: string;
    model: string;
    totalServices: number;
    damageBreakdown: Record<string, number>;
  }
  
  // Aggregate service history by device (brand + model)
  const deviceServiceMap: Record<string, DeviceServiceSummary> = {};
  
  contactServiceNotas.forEach(nota => {
    // Get device info
    const brand = nota.merk || nota.brand_hp || 'Unknown Brand';
    const model = nota.tipe || nota.model_hp || 'Unknown Model';
    const deviceKey = `${brand} ${model}`;
    
    // Initialize device entry
    if (!deviceServiceMap[deviceKey]) {
      deviceServiceMap[deviceKey] = {
        deviceKey,
        brand,
        model,
        totalServices: 0,
        damageBreakdown: {}
      };
    }
    
    // Increment service count
    deviceServiceMap[deviceKey].totalServices += 1;
    
    // Aggregate damages
    // Try multiple sources for damage/keluhan info
    const damages: string[] = [];
    
    // Source 1: detected_damage_types (newer structure)
    if (nota.detected_damage_types && nota.detected_damage_types.length > 0) {
      damages.push(...nota.detected_damage_types);
    }
    
    // Source 2: keluhan (raw text - extract if available)
    if (nota.keluhan && !damages.length) {
      // Simple heuristic: if keluhan contains common damage keywords
      const commonDamages = ['LCD', 'Baterai', 'Kamera', 'Papan Cas', 'Flexible', 'Backdoor', 'Speaker'];
      commonDamages.forEach(damage => {
        if (nota.keluhan!.toLowerCase().includes(damage.toLowerCase())) {
          damages.push(damage);
        }
      });
    }
    
    // Source 3: subPesanan items (if no damage detected yet)
    if (nota.subPesanan && nota.subPesanan.length > 0 && !damages.length) {
      nota.subPesanan.forEach(sub => {
        if (sub.kategori) {
          damages.push(sub.kategori);
        }
      });
    }
    
    // Fallback: if still no damage, mark as "General Service"
    if (!damages.length) {
      damages.push('General Service');
    }
    
    // Count damage occurrences
    damages.forEach(damage => {
      if (!deviceServiceMap[deviceKey].damageBreakdown[damage]) {
        deviceServiceMap[deviceKey].damageBreakdown[damage] = 0;
      }
      deviceServiceMap[deviceKey].damageBreakdown[damage] += 1;
    });
  });
  
  // Convert to array and sort by service count
  const deviceServiceSummaries = Object.values(deviceServiceMap)
    .sort((a, b) => b.totalServices - a.totalServices);
  
  // Auto-generate warning flag
  const hasRepeatService = deviceServiceSummaries.some(device => device.totalServices >= 3);
  
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 md:gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h2 className="text-xl md:text-2xl font-medium">{contact.name}</h2>
            <p className="text-xs md:text-sm text-muted-foreground">{contact.phone}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => onEdit(contact)}>
          Edit Info
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Total Nota</p>
                <p className="text-xl md:text-2xl font-bold">{totalNota}</p>
              </div>
              <User className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Total Service</p>
                <p className="text-xl md:text-2xl font-bold">{totalService}</p>
              </div>
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Total Pesanan</p>
                <p className="text-xl md:text-2xl font-bold">{totalPesanan}</p>
              </div>
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Aktivitas</p>
                <p className="text-xs md:text-sm">
                  {lastActivity ? lastActivity.toLocaleDateString('id-ID', { 
                    day: 'numeric',
                    month: 'short'
                  }) : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="ringkasan">Ringkasan Service</TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat Nota</TabsTrigger>
        </TabsList>
        
        {/* ============================================================ */}
        {/* TAB 1: INFO (STATIC DATA)                                    */}
        {/* ============================================================ */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nama</label>
                <p className="mt-1">{contact.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">No HP</label>
                <p className="mt-1">{contact.phone || '-'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <div className="mt-1">
                  <Badge>
                    {contact.type === 'customer' ? 'Pelanggan' :
                     contact.type === 'supplier' ? 'Supplier' :
                     contact.type === 'vendor' ? 'Vendor' :
                     'Pelanggan & Supplier'}
                  </Badge>
                </div>
              </div>
              
              {contact.email && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="mt-1">{contact.email}</p>
                </div>
              )}
              
              {contact.address && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Alamat</label>
                  <p className="mt-1">{contact.address}</p>
                </div>
              )}
              
              {contact.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Catatan Internal</label>
                  <p className="mt-1 text-sm">{contact.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* ============================================================ */}
        {/* TAB 2: RINGKASAN SERVICE (AUTO-AGGREGATE, TEXT ONLY)        */}
        {/* ============================================================ */}
        <TabsContent value="ringkasan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Service</CardTitle>
              <p className="text-sm text-muted-foreground">
                Memberi peringatan & konteks cepat ke teknisi/kasir saat ketemu pelanggan
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Device Frequency (TEXT ONLY) */}
              {deviceServiceSummaries.length > 0 ? (
                <div className="space-y-4">
                  {deviceServiceSummaries.map((device) => (
                    <div key={device.deviceKey} className="border-b pb-4 last:border-b-0">
                      <h4 className="font-medium mb-2">
                        📱 {device.brand} {device.model} — {device.totalServices}x service
                      </h4>
                      <div className="ml-4 space-y-1 text-sm">
                        {Object.entries(device.damageBreakdown)
                          .sort((a, b) => b[1] - a[1])
                          .map(([damage, count]) => (
                            <div key={damage} className="flex items-center gap-2">
                              <span className="text-muted-foreground">•</span>
                              <span>{damage}: {count}x</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Belum ada riwayat service untuk kontak ini
                </p>
              )}
              
              {/* Auto Note (Optional, Internal Only) */}
              {hasRepeatService && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">Auto Note (Internal)</span>
                  </div>
                  <p className="text-sm">
                    ⚠️ Perbaikan berulang — pertimbangkan ganti device
                  </p>
                </div>
              )}
              
              {!hasRepeatService && totalService > 0 && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Status Normal</span>
                  </div>
                  <p className="text-sm">
                    ✅ Riwayat service dalam batas wajar
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* ============================================================ */}
        {/* TAB 3: RIWAYAT NOTA (SERVICE & PESANAN)                     */}
        {/* ============================================================ */}
        <TabsContent value="riwayat" className="space-y-4">
          {/* Riwayat Nota Service */}
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Nota Service</CardTitle>
            </CardHeader>
            <CardContent>
              {contactServiceNotas.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Belum ada riwayat service
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-4 pb-2 border-b text-sm font-medium text-muted-foreground">
                    <div>Tanggal</div>
                    <div>Device</div>
                    <div>Status</div>
                    <div>Hasil</div>
                  </div>
                  {contactServiceNotas
                    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
                    .map(nota => {
                      const statusBadge = nota.status === 'Diambil' ? 'success' :
                                         nota.status === 'Selesai' ? 'default' :
                                         'secondary';
                      
                      const resultBadge = nota.service_result === 'SUCCESS' ? 'success' :
                                         nota.service_result === 'FAILED' ? 'destructive' :
                                         'secondary';
                      
                      return (
                        <div 
                          key={nota.id}
                          className="grid grid-cols-4 gap-4 py-2 border-b hover:bg-accent/50 cursor-pointer text-sm"
                        >
                          <div>
                            {new Date(nota.tanggal).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                          <div>
                            {nota.merk || nota.brand_hp || 'N/A'} {nota.tipe || nota.model_hp || ''}
                          </div>
                          <div>
                            <Badge variant={statusBadge as any}>
                              {nota.status}
                            </Badge>
                          </div>
                          <div>
                            {nota.service_result ? (
                              <Badge variant={resultBadge as any}>
                                {nota.service_result === 'SUCCESS' ? 'Berhasil' :
                                 nota.service_result === 'FAILED' ? 'Gagal' :
                                 nota.service_result}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Riwayat Nota Pesanan */}
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Nota Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              {contactPesananNotas.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Belum ada riwayat pesanan
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-4 pb-2 border-b text-sm font-medium text-muted-foreground">
                    <div>Tanggal</div>
                    <div>Total</div>
                    <div>Status</div>
                  </div>
                  {contactPesananNotas.map(nota => (
                    <div 
                      key={nota.id}
                      className="grid grid-cols-3 gap-4 py-2 border-b hover:bg-accent/50 cursor-pointer text-sm"
                    >
                      <div>{new Date(nota.tanggal).toLocaleDateString('id-ID')}</div>
                      <div>Rp {nota.total?.toLocaleString() || 0}</div>
                      <div>
                        <Badge variant={nota.status === 'PAID' ? 'success' : 'secondary'}>
                          {nota.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
