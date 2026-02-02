// OriginalName: DamageTypeList
// ShortName: DmgList

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Edit, Trash2, Search, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '../../ui/alert';
import type { DamageType } from '../../../types/nota';

interface DamageListProps {
  damageTypes: DamageType[];
  onEdit: (damage: DamageType) => void;
  onDelete: (id: string) => void;
}

export function DmgList({ damageTypes, onEdit, onDelete }: DamageListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDamages = damageTypes.filter((d) =>
    searchQuery === '' ||
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Hardware':
        return 'bg-blue-500';
      case 'Software':
        return 'bg-purple-500';
      case 'Physical':
        return 'bg-red-500';
      case 'Battery':
        return 'bg-yellow-500';
      case 'Display':
        return 'bg-green-500';
      case 'Audio':
        return 'bg-pink-500';
      case 'Network':
        return 'bg-cyan-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (damageTypes.length === 0) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Belum ada jenis kerusakan. Klik "Tambah Kerusakan" untuk menambahkan.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari jenis kerusakan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Kerusakan</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDamages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Tidak ada data
                </TableCell>
              </TableRow>
            ) : (
              filteredDamages.map((damage) => (
                <TableRow key={damage.id}>
                  <TableCell className="font-medium">{damage.name}</TableCell>
                  <TableCell>
                    {damage.category && (
                      <Badge className={getCategoryColor(damage.category)}>
                        {damage.category}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {damage.description || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(damage)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(damage.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stats */}
      <div className="text-sm text-muted-foreground">
        Total: {filteredDamages.length} jenis kerusakan
      </div>
    </div>
  );
}
