// OriginalName: TransactionDialog
// ShortName: TxDlg

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ShoppingCart, DollarSign } from 'lucide-react';
import { SaleTab } from './SaleTab';
import { ExpTab } from './ExpTab';
import type { Product, Category, Contact } from '../../types/inventory';

interface TxDlgProps {
  open: boolean;
  onClose: () => void;
  mode: 'dashboard' | 'manual';
  defaultTab?: 'sale' | 'expense';
  products?: Product[];
  categories?: Category[];
  contacts?: Contact[];
  onTransactionCreate: (transaction: any) => void;
  onStockLogCreate?: (log: any) => void;
  onProductUpdate?: (product: Product) => void;
  onContactCreate?: (contact: any) => Promise<void>;
  onCategoryCreate?: (category: any) => Promise<void>;
  onProductCreate?: (product: any) => Promise<void>;
}

export function TxDlg({
  open,
  onClose,
  mode,
  defaultTab = 'sale',
  products = [],
  categories = [],
  contacts = [],
  onTransactionCreate,
  onStockLogCreate,
  onProductUpdate,
  onContactCreate,
  onCategoryCreate,
  onProductCreate,
}: TxDlgProps) {
  const [activeTab, setActiveTab] = useState<'sale' | 'expense'>(defaultTab);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleTransactionCreated = (transaction: any) => {
    onTransactionCreate(transaction);
    handleClose();
  };

  const handleClose = () => {
    setActiveTab(defaultTab);
    onClose();
  };

  const isManualMode = mode === 'manual';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isManualMode ? 'Tambah Transaksi Manual' : 'Tambah Transaksi'}
          </DialogTitle>
          <DialogDescription>
            Catat transaksi penjualan atau pengeluaran bisnis Anda
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'sale' | 'expense')}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sale">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Penjualan
            </TabsTrigger>
            <TabsTrigger value="expense">
              <DollarSign className="w-4 h-4 mr-2" />
              Pengeluaran
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sale">
            <SaleTab
              products={products}
              categories={categories}
              contacts={contacts}
              onTransactionCreate={handleTransactionCreated}
              onProductUpdate={onProductUpdate}
              onStockLogCreate={onStockLogCreate}
              onContactCreate={onContactCreate}
              onCategoryCreate={onCategoryCreate}
              onProductCreate={onProductCreate}
              formatCurrency={formatCurrency}
              onClose={handleClose}
            />
          </TabsContent>

          <TabsContent value="expense">
            <ExpTab
              onTransactionCreate={handleTransactionCreated}
              formatCurrency={formatCurrency}
              onCategoryCreate={onCategoryCreate}
              onClose={handleClose}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}