// OriginalName: QualityDeadStockAnalysis
// ShortName: QualDead

import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { AlertTriangle, Archive, TrendingDown, Package } from 'lucide-react';

const formatRupiah = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
};

const deadStock = [
  {
    item: 'LCD OPPO A5s',
    qty: 8,
    value: 4800000,
    lastMove: '145 hari',
    urgency: 'high',
  },
  {
    item: 'Flexibel Vivo Y12',
    qty: 5,
    value: 1250000,
    lastMove: '98 hari',
    urgency: 'high',
  },
  {
    item: 'Baterai Xiaomi Note 8',
    qty: 12,
    value: 1800000,
    lastMove: '72 hari',
    urgency: 'medium',
  },
  {
    item: 'IC Audio Universal',
    qty: 6,
    value: 900000,
    lastMove: '65 hari',
    urgency: 'medium',
  },
];

const slowMovers = [
  { item: 'Touchscreen Realme C11', qty: 4, sales30d: 1, avgSales: 0.5 },
  { item: 'Kamera Belakang Vivo Y15', qty: 7, sales30d: 2, avgSales: 1.2 },
  { item: 'Speaker Samsung J2 Prime', qty: 10, sales30d: 3, avgSales: 1.8 },
];

const problematicItems = [
  { item: 'LCD Brandless A02', returns: 8, installs: 25, failRate: 32 },
  { item: 'Flexibel KW Infinix Hot 10', returns: 5, installs: 18, failRate: 28 },
  { item: 'Mic Universal Batch-X', returns: 4, installs: 20, failRate: 20 },
];

export function QualDead() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Dead Stock</span>
            <Archive className="size-4 text-red-600" />
          </div>
          <p className="text-2xl">31 items</p>
          <p className="text-xs text-muted-foreground mt-1">{formatRupiah(8750000)}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Slow Movers</span>
            <TrendingDown className="size-4 text-orange-600" />
          </div>
          <p className="text-2xl">18 items</p>
          <p className="text-xs text-orange-600 mt-1">Perputaran lambat</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Barang Bermasalah</span>
            <AlertTriangle className="size-4 text-red-600" />
          </div>
          <p className="text-2xl">12 items</p>
          <p className="text-xs text-red-600 mt-1">High failure rate</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Archive className="size-5 text-red-600" />
          <h3>Dead Stock Detector</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Barang yang tidak bergerak lebih dari 60 hari
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Barang</th>
                <th className="text-center p-3">Qty</th>
                <th className="text-right p-3">Nilai</th>
                <th className="text-right p-3">Last Move</th>
                <th className="text-right p-3">Urgency</th>
              </tr>
            </thead>
            <tbody>
              {deadStock.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="p-3">{item.item}</td>
                  <td className="text-center p-3">{item.qty}</td>
                  <td className="text-right p-3">{formatRupiah(item.value)}</td>
                  <td className="text-right p-3 text-muted-foreground">{item.lastMove}</td>
                  <td className="text-right p-3">
                    <Badge variant={item.urgency === 'high' ? 'destructive' : 'default'}>
                      {item.urgency === 'high' ? 'High' : 'Medium'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="size-5 text-orange-600" />
            <h3>Slow Movers</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Barang dengan penjualan rendah dalam 30 hari terakhir
          </p>
          <div className="space-y-3">
            {slowMovers.map((item, idx) => (
              <div key={idx} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm">{item.item}</p>
                  <Badge variant="outline">{item.qty} stock</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>Sales 30d: {item.sales30d}x</div>
                  <div>Avg: {item.avgSales}x/bulan</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="size-5 text-red-600" />
            <h3>Barang Bermasalah</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Sparepart dengan failure rate tinggi
          </p>
          <div className="space-y-3">
            {problematicItems.map((item, idx) => (
              <div key={idx} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm">{item.item}</p>
                  <Badge variant="destructive">{item.failRate}% fail</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>Returns: {item.returns}</div>
                  <div>Installs: {item.installs}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
