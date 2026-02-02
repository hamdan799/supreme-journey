// OriginalName: RepairAIAnalytics
// ShortName: RepairAnaly

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { RepairPerf } from './RepairPerf';
import { SPQual } from './SPQual';
import { VendQual } from './VendQual';
import { AIDiag } from './AIDiag';
import { Forecast } from './Forecast';
import { Insights } from './Insights';

export function RepairAnaly() {
  const [activeTab, setActiveTab] = useState('performance');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2>Analisis Repair & AI</h2>
        <p className="text-sm text-muted-foreground">
          Performa service, kualitas sparepart, AI diagnosis, dan forecast
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="performance">Repair Performance</TabsTrigger>
          <TabsTrigger value="sparepart">Sparepart Quality</TabsTrigger>
          <TabsTrigger value="vendor">Vendor Quality</TabsTrigger>
          <TabsTrigger value="ai">AI Diagnosis</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="insights">Business Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <RepairPerf />
        </TabsContent>

        <TabsContent value="sparepart" className="space-y-6">
          <SPQual />
        </TabsContent>

        <TabsContent value="vendor" className="space-y-6">
          <VendQual />
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <AIDiag />
        </TabsContent>

        <TabsContent value="forecast" className="space-y-6">
          <Forecast />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Insights />
        </TabsContent>
      </Tabs>
    </div>
  );
}