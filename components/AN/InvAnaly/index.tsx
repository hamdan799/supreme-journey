// OriginalName: InventoryAnalytics
// ShortName: InvAnaly

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Calendar } from 'lucide-react';
import { InvOverview } from './InvOverview';
import { StockMove } from './StockMove';
import { QualDead } from './QualDead';
import { BrandModel } from './BrandModel';

export function InvAnaly() {
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('30d');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Analisis Inventory</h2>
          <p className="text-sm text-muted-foreground">
            Kesehatan stok, pergerakan, dan kualitas inventory
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
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="movement">Stock Movement</TabsTrigger>
          <TabsTrigger value="quality">Dead Stock & Quality</TabsTrigger>
          <TabsTrigger value="brand">Brand & Model Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <InvOverview />
        </TabsContent>

        <TabsContent value="movement" className="space-y-6">
          <StockMove />
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <QualDead />
        </TabsContent>

        <TabsContent value="brand" className="space-y-6">
          <BrandModel />
        </TabsContent>
      </Tabs>
    </div>
  );
}