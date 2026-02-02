// OriginalName: SalesAnalytics
// ShortName: SalesAnaly

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Calendar } from 'lucide-react';
import { SumCards } from './SumCards';
import { TimeChart } from './TimeChart';
import { TopProds } from './TopProds';
import { CatBrand } from './CatBrand';
import { TimePat } from './TimePat';
import { CustRFM } from './CustRFM';
import { SmartInsight } from './SmartInsight';

export function SalesAnaly() {
  const [activeTab, setActiveTab] = useState('summary');
  const [period, setPeriod] = useState('30d');

  return (
    <div className="p-6 space-y-6">
      {/* Header & Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Analisis Penjualan</h2>
          <p className="text-sm text-muted-foreground">
            Insight lengkap tentang penjualan, produk, dan pelanggan
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="size-4 text-muted-foreground" />
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Hari Terakhir</SelectItem>
              <SelectItem value="30d">30 Hari Terakhir</SelectItem>
              <SelectItem value="90d">90 Hari Terakhir</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="timeseries">Time Series</TabsTrigger>
          <TabsTrigger value="top">Top Products</TabsTrigger>
          <TabsTrigger value="category">Category & Brand</TabsTrigger>
          <TabsTrigger value="pattern">Time Pattern</TabsTrigger>
          <TabsTrigger value="rfm">Customer RFM</TabsTrigger>
          <TabsTrigger value="insights">Smart Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <SumCards />
        </TabsContent>

        <TabsContent value="timeseries" className="space-y-6">
          <TimeChart />
        </TabsContent>

        <TabsContent value="top" className="space-y-6">
          <TopProds />
        </TabsContent>

        <TabsContent value="category" className="space-y-6">
          <CatBrand />
        </TabsContent>

        <TabsContent value="pattern" className="space-y-6">
          <TimePat />
        </TabsContent>

        <TabsContent value="rfm" className="space-y-6">
          <CustRFM />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <SmartInsight />
        </TabsContent>
      </Tabs>
    </div>
  );
}