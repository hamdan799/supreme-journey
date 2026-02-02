// OriginalName: DamageType (Master Data)
// ShortName: DT

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Plus, FileText } from 'lucide-react';
import { DmgForm } from './DmgForm';
import { DmgList } from './DmgList';
import type { DamageType } from '../../../types/nota';

interface DTProps {
  damageTypes: DamageType[];
  onDamageCreate: (damage: Partial<DamageType>) => void;
  onDamageUpdate: (id: string, updates: Partial<DamageType>) => void;
  onDamageDelete: (id: string) => void;
}

export function DamageType({
  damageTypes,
  onDamageCreate,
  onDamageUpdate,
  onDamageDelete
}: DTProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingDamage, setEditingDamage] = useState<DamageType | null>(null);

  const handleEdit = (damage: DamageType) => {
    setEditingDamage(damage);
    setShowForm(true);
  };

  const handleSubmit = (data: Partial<DamageType>) => {
    if (editingDamage) {
      onDamageUpdate(editingDamage.id, data);
    } else {
      onDamageCreate(data);
    }
    setEditingDamage(null);
  };

  const handleFormClose = (open: boolean) => {
    setShowForm(open);
    if (!open) {
      setEditingDamage(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Jenis Kerusakan HP
              </CardTitle>
              <CardDescription>
                Kelola daftar jenis kerusakan HP yang umum terjadi untuk mempermudah input service
              </CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kerusakan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DmgList
            damageTypes={damageTypes}
            onEdit={handleEdit}
            onDelete={onDamageDelete}
          />
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <DmgForm
        open={showForm}
        onOpenChange={handleFormClose}
        damage={editingDamage}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
