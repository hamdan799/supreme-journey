// OriginalName: AIDiagnosisPanel
// ShortName: AIDiag

import { useState, useMemo } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Badge } from '../../ui/badge';
import { Sparkles, AlertCircle, Clock, DollarSign, Database } from 'lucide-react';
import { useBlueprintCollections } from '../../../hooks/useBlueprintCollections';

const formatRupiah = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
};

const diagnosisResult = {
  brand: 'Infinix',
  model: 'Hot 10',
  complaint: 'Lawan bicara tidak dengar suara',
  predictions: [
    {
      issue: 'Jalur Mic Upper Board',
      probability: 78,
      location: 'Upper Board - Jalur Mic',
      difficulty: 'Sedang',
      avgTime: 3.5,
      costRange: { min: 50000, max: 150000 },
      sparepart: 'Tidak Perlu (Jalur)',
    },
    {
      issue: 'Mic Connector (Bawah)',
      probability: 16,
      location: 'Lower Board - Mic Connector',
      difficulty: 'Mudah',
      avgTime: 1.5,
      costRange: { min: 30000, max: 80000 },
      sparepart: 'Mic Universal',
    },
    {
      issue: 'Codec Audio IC',
      probability: 6,
      location: 'Main Board - Audio IC',
      difficulty: 'Susah',
      avgTime: 6.0,
      costRange: { min: 200000, max: 400000 },
      sparepart: 'Audio IC',
    },
  ],
};

const patterns = [
  {
    brand: 'Samsung',
    model: 'A02',
    commonIssues: [
      { complaint: 'LCD Tidak Tampil', rootCause: 'LCD Connector (65%)', count: 15 },
      { complaint: 'Touchscreen Tidak Responsif', rootCause: 'Touchscreen Cable (58%)', count: 12 },
    ],
  },
  {
    brand: 'Vivo',
    model: 'Y21',
    commonIssues: [
      { complaint: 'Charging Lambat', rootCause: 'IC Charging 1612 (55%)', count: 12 },
      { complaint: 'Baterai Boros', rootCause: 'Baterai Degradasi (72%)', count: 9 },
    ],
  },
];

export function AIDiag() {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState('');
  const [showResult, setShowResult] = useState(false);

  // MODE B: Pakai data observasi real dari phoneModels
  const { phoneBrands, phoneModels } = useBlueprintCollections();

  // Extract unique brands dari data observasi
  const observedBrands = useMemo(() => {
    const brandSet = new Set(phoneModels.map(m => m.brand));
    return Array.from(brandSet).sort();
  }, [phoneModels]);

  // Get models untuk selected brand dari data observasi
  const observedModelsForBrand = useMemo(() => {
    if (!selectedBrand) return [];
    return phoneModels
      .filter(m => m.brand === selectedBrand)
      .map(m => m.model)
      .sort();
  }, [selectedBrand, phoneModels]);

  const handleDiagnose = () => {
    setShowResult(true);
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="size-5 text-purple-600" />
          <h3>AI Predictive Diagnosis</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          AI akan memprediksi kemungkinan kerusakan berdasarkan data historis nota service
        </p>

        {/* MODE B: Info data observasi */}
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-100">
            <Database className="size-4" />
            <span>
              <strong>{phoneModels.length} observasi</strong> model HP tercatat dari {observedBrands.length} brand
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm mb-2 block">Brand HP</label>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih brand..." />
              </SelectTrigger>
              <SelectContent>
                {observedBrands.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    Belum ada data observasi
                  </SelectItem>
                ) : (
                  observedBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm mb-2 block">Model HP</label>
            <Select 
              value={selectedModel} 
              onValueChange={setSelectedModel}
              disabled={!selectedBrand}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedBrand ? "Pilih model..." : "Pilih brand dulu"} />
              </SelectTrigger>
              <SelectContent>
                {observedModelsForBrand.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    Belum ada model terobservasi
                  </SelectItem>
                ) : (
                  observedModelsForBrand.map(model => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm mb-2 block">Keluhan</label>
            <Select value={selectedComplaint} onValueChange={setSelectedComplaint}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih keluhan..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mic">Lawan bicara tidak dengar</SelectItem>
                <SelectItem value="lcd">LCD tidak tampil</SelectItem>
                <SelectItem value="charging">Charging bermasalah</SelectItem>
                <SelectItem value="touch">Touchscreen error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleDiagnose} className="w-full md:w-auto">
          <Sparkles className="size-4 mr-2" />
          Diagnosa dengan AI
        </Button>
      </Card>

      {showResult && (
        <Card className="p-6 bg-purple-50 dark:bg-purple-950/20">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="size-5 text-purple-600" />
            <h3>Hasil AI Diagnosis</h3>
          </div>
          <div className="mb-4 p-3 bg-white dark:bg-gray-900 rounded">
            <p className="text-sm text-muted-foreground mb-1">Input:</p>
            <p>
              <strong>{diagnosisResult.brand} {diagnosisResult.model}</strong> - {diagnosisResult.complaint}
            </p>
          </div>

          <div className="space-y-3">
            {diagnosisResult.predictions.map((pred, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-lg border-2 ${
                  idx === 0 ? 'bg-green-50 dark:bg-green-950/20 border-green-300' : 'bg-white dark:bg-gray-900 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4>{pred.issue}</h4>
                      {idx === 0 && <Badge variant="default" className="bg-green-600">Paling Mungkin</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{pred.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{pred.probability}%</div>
                    <div className="text-xs text-muted-foreground">Probability</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="size-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Kesulitan</div>
                      <div>{pred.difficulty}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Estimasi Waktu</div>
                      <div>{pred.avgTime} jam</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Biaya</div>
                      <div>{formatRupiah(pred.costRange.min)} - {formatRupiah(pred.costRange.max)}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Sparepart</div>
                    <div>{pred.sparepart}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>💡 Insight:</strong> Berdasarkan 18 kasus serupa, 78% penyebabnya adalah jalur mic upper board, bukan sparepart mic-nya. Cek jalur terlebih dahulu sebelum ganti sparepart.
            </p>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="mb-4">Pola Kerusakan Umum (Pattern Recognition)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          AI telah memetakan pola kerusakan dari data historis
        </p>
        <div className="space-y-6">
          {patterns.map((pattern, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <h4 className="mb-3">{pattern.brand} {pattern.model}</h4>
              <div className="space-y-2">
                {pattern.commonIssues.map((issue, iidx) => (
                  <div key={iidx} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div className="flex-1">
                      <p className="text-sm mb-1">{issue.complaint}</p>
                      <p className="text-xs text-muted-foreground">{issue.rootCause}</p>
                    </div>
                    <Badge variant="outline">{issue.count} kasus</Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}