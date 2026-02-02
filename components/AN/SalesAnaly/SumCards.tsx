// OriginalName: SalesSummaryCards
// ShortName: SumCards

import { Card } from '../../ui/card';
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';

const formatRupiah = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
};

export function SumCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Total Revenue</span>
          <DollarSign className="size-4 text-green-600" />
        </div>
        <div className="space-y-1">
          <p className="text-2xl">{formatRupiah(125000000)}</p>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="size-3" />
            <span>+15% dari bulan lalu</span>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Total Transaksi</span>
          <ShoppingCart className="size-4 text-blue-600" />
        </div>
        <div className="space-y-1">
          <p className="text-2xl">487</p>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="size-3" />
            <span>+8% dari bulan lalu</span>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">AOV</span>
          <TrendingUp className="size-4 text-purple-600" />
        </div>
        <div className="space-y-1">
          <p className="text-2xl">{formatRupiah(256687)}</p>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="size-3" />
            <span>+6% dari bulan lalu</span>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Produk Terlaris</span>
          <Package className="size-4 text-orange-600" />
        </div>
        <div className="space-y-1">
          <p className="text-lg">LCD Samsung A02</p>
          <p className="text-xs text-muted-foreground">28 unit terjual hari ini</p>
        </div>
      </Card>
    </div>
  );
}
