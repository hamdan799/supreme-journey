// OriginalName: ExpenseTab
// ShortName: ExpTab

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Calculator, Save, ChevronRight, Plus } from 'lucide-react';
import { CalcWidget } from './CalcWidget';
import { toast } from 'sonner';

interface ExpTabProps {
  onTransactionCreate: (transaction: any) => void;
  formatCurrency: (amount: number) => string;
  onCategoryCreate?: (category: any) => Promise<void>;
  onClose?: () => void;
}

export function ExpTab({ onTransactionCreate, formatCurrency, onCategoryCreate, onClose }: ExpTabProps) {
  const [step, setStep] = useState(1);
  const [totalExpense, setTotalExpense] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [showNewCategory, setShowNewCategory] = useState(false);

  const handleCalculatorInput = (value: string) => {
    if (value === 'C') {
      setCalcDisplay('0');
    } else if (value === '←') {
      setCalcDisplay(calcDisplay.length > 1 ? calcDisplay.slice(0, -1) : '0');
    } else if (value === '=') {
      try {
        const result = eval(calcDisplay);
        setCalcDisplay(result.toString());
        setTotalExpense(result.toString());
        setShowCalculator(false);
      } catch {
        toast.error('Perhitungan tidak valid');
      }
    } else {
      setCalcDisplay(calcDisplay === '0' ? value : calcDisplay + value);
    }
  };

  const handleSaveTransaction = () => {
    if (!totalExpense || Number(totalExpense) <= 0) {
      toast.error('Masukkan jumlah pengeluaran');
      return;
    }

    const transactionData = {
      type: 'pengeluaran' as const,
      nominal: Number(totalExpense),
      kategori: expenseCategory || newExpenseCategory || 'Lainnya',
      catatan: description || undefined,
      tanggal: new Date(transactionDate),
      paymentStatus: 'lunas' as const,
    };

    onTransactionCreate(transactionData);
    toast.success('Transaksi pengeluaran berhasil disimpan');
  };

  return (
    <div className="space-y-6 mt-4 pb-6">
      {/* Step 1: Jumlah Pengeluaran */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Step 1: Jumlah Pengeluaran</h3>
          <Badge variant={totalExpense ? 'default' : 'secondary'}>
            {totalExpense ? formatCurrency(Number(totalExpense)) : 'Belum diisi'}
          </Badge>
        </div>

        <div className="space-y-2">
          <Label>Total Pengeluaran *</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={totalExpense}
              onChange={(e) => setTotalExpense(e.target.value)}
              placeholder="0"
              className="text-lg"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowCalculator(!showCalculator)}
            >
              <Calculator className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CalcWidget
          open={showCalculator}
          display={calcDisplay}
          onInput={handleCalculatorInput}
        />

        {totalExpense && Number(totalExpense) > 0 && (
          <Button className="w-full" onClick={() => setStep(2)}>
            Lanjut ke Kategori
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Step 2: Kategori & Detail */}
      {step >= 2 && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">Step 2: Kategori & Detail</h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Kategori Pengeluaran</Label>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowNewCategory(!showNewCategory)}
              >
                <Plus className="w-3 h-3 mr-1" />
                Kategori Baru
              </Button>
            </div>

            {showNewCategory ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Nama kategori baru"
                  value={newExpenseCategory}
                  onChange={(e) => setNewExpenseCategory(e.target.value)}
                />
                <Button
                  size="sm"
                  onClick={async () => {
                    if (newExpenseCategory.trim()) {
                      // Save to Product Management categories
                      if (onCategoryCreate) {
                        await onCategoryCreate({
                          name: newExpenseCategory.trim(),
                          description: 'Kategori pengeluaran',
                        });
                        toast.success('Kategori berhasil disimpan ke Product Management');
                      }
                      setExpenseCategory(newExpenseCategory);
                      setNewExpenseCategory('');
                      setShowNewCategory(false);
                    }
                  }}
                >
                  Pakai
                </Button>
              </div>
            ) : (
              <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operasional">Operasional</SelectItem>
                  <SelectItem value="Gaji">Gaji</SelectItem>
                  <SelectItem value="Sewa">Sewa</SelectItem>
                  <SelectItem value="Utilitas">Utilitas</SelectItem>
                  <SelectItem value="Pajak">Pajak</SelectItem>
                  <SelectItem value="Pembelian Stok">Pembelian Stok</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tanggal</Label>
            <Input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Deskripsi Detail</Label>
            <Textarea
              placeholder="Catatan pengeluaran..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              type="button"
            >
              Batal
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                toast.info('Fitur draft akan segera tersedia');
              }}
              type="button"
            >
              Simpan Draft
            </Button>
            <Button
              className="flex-1"
              onClick={handleSaveTransaction}
              type="button"
            >
              <Save className="w-4 h-4 mr-2" />
              Simpan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
