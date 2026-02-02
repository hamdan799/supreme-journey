// OriginalName: ReportExportEngine
// ShortName: ExportEngine

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  Download,
  FileText,
  FileSpreadsheet,
  Printer,
  Mail,
  Share2,
  CheckCircle2,
  Loader2,
  Calendar,
  Filter
} from 'lucide-react'
import type { Transaction } from '../../types/financial'
import type { Product } from '../../types/inventory'

interface ExportEngineProps {
  data: {
    transactions: Transaction[]
    products: Product[]
    dateRange: { start: string; end: string }
  }
  reportType: string
}

type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json'

interface ExportJob {
  id: string
  format: ExportFormat
  status: 'pending' | 'processing' | 'completed' | 'failed'
  filename: string
  createdAt: Date
  size?: number
}

export function ExportEngine({ data, reportType }: ExportEngineProps) {
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([])
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const startExport = async (format: ExportFormat) => {
    const job: ExportJob = {
      id: `export-${Date.now()}`,
      format,
      status: 'pending',
      filename: `report-${reportType}-${format}-${Date.now()}.${format === 'excel' ? 'xlsx' : format}`,
      createdAt: new Date()
    }

    setExportJobs(prev => [job, ...prev])

    // Simulate processing
    setTimeout(() => {
      setExportJobs(prev => prev.map(j => 
        j.id === job.id ? { ...j, status: 'processing' } : j
      ))
    }, 500)

    // Generate export
    try {
      let content = ''
      let mimeType = 'text/plain'

      switch (format) {
        case 'csv':
          content = generateCSV()
          mimeType = 'text/csv'
          break
        case 'json':
          content = generateJSON()
          mimeType = 'application/json'
          break
        case 'pdf':
          content = generatePDFText()
          mimeType = 'text/plain'
          break
        case 'excel':
          content = generateExcelCSV()
          mimeType = 'text/csv'
          break
      }

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Download file
      downloadFile(content, job.filename, mimeType)

      // Update job status
      setExportJobs(prev => prev.map(j => 
        j.id === job.id ? { 
          ...j, 
          status: 'completed',
          size: new Blob([content]).size
        } : j
      ))
    } catch (error) {
      setExportJobs(prev => prev.map(j => 
        j.id === job.id ? { ...j, status: 'failed' } : j
      ))
    }
  }

  const generateCSV = (): string => {
    let csv = 'Type,Date,Customer,Description,Amount,Category,Payment\n'
    
    data.transactions.forEach(t => {
      const date = new Date(t.tanggal || t.createdAt).toLocaleDateString('id-ID')
      const customer = t.customerName || '-'
      const description = t.keterangan || '-'
      const amount = t.nominal
      const category = t.kategori || '-'
      const payment = t.payment || '-'
      
      csv += `"${t.type}","${date}","${customer}","${description}",${amount},"${category}","${payment}"\n`
    })

    return csv
  }

  const generateJSON = (): string => {
    const exportData = {
      reportType,
      dateRange: data.dateRange,
      generatedAt: new Date().toISOString(),
      summary: {
        totalTransactions: data.transactions.length,
        totalRevenue: data.transactions.filter(t => t.type === 'pemasukan').reduce((sum, t) => sum + t.nominal, 0),
        totalExpenses: data.transactions.filter(t => t.type === 'pengeluaran').reduce((sum, t) => sum + t.nominal, 0)
      },
      transactions: data.transactions.map(t => ({
        id: t.id,
        type: t.type,
        date: t.tanggal || t.createdAt,
        customer: t.customerName,
        description: t.keterangan,
        amount: t.nominal,
        category: t.kategori,
        payment: t.payment,
        items: t.items
      })),
      products: data.products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        stock: p.stock,
        price: p.price,
        cost: p.cost
      }))
    }

    return JSON.stringify(exportData, null, 2)
  }

  const generatePDFText = (): string => {
    const { transactions } = data
    const revenue = transactions.filter(t => t.type === 'pemasukan').reduce((sum, t) => sum + t.nominal, 0)
    const expenses = transactions.filter(t => t.type === 'pengeluaran').reduce((sum, t) => sum + t.nominal, 0)
    const profit = revenue - expenses

    let content = `BUSINESS REPORT\n`
    content += `Report Type: ${reportType}\n`
    content += `Period: ${data.dateRange.start} - ${data.dateRange.end}\n`
    content += `Generated: ${new Date().toLocaleString('id-ID')}\n`
    content += `\n${'='.repeat(80)}\n\n`
    
    content += `FINANCIAL SUMMARY\n`
    content += `${'-'.repeat(80)}\n`
    content += `Total Revenue      : ${formatCurrency(revenue)}\n`
    content += `Total Expenses     : ${formatCurrency(expenses)}\n`
    content += `Net Profit         : ${formatCurrency(profit)}\n`
    content += `Profit Margin      : ${revenue > 0 ? ((profit / revenue) * 100).toFixed(2) : '0.00'}%\n`
    content += `Total Transactions : ${transactions.length}\n`
    content += `\n`

    content += `TRANSACTION DETAILS\n`
    content += `${'-'.repeat(80)}\n`
    content += `Date       | Type        | Customer           | Amount          \n`
    content += `${'-'.repeat(80)}\n`

    transactions.slice(0, 50).forEach(t => {
      const date = new Date(t.tanggal || t.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
      const type = t.type === 'pemasukan' ? 'Income' : 'Expense'
      const customer = (t.customerName || '-').substring(0, 18).padEnd(18)
      const amount = formatCurrency(t.nominal).padStart(15)
      
      content += `${date} | ${type.padEnd(11)} | ${customer} | ${amount}\n`
    })

    if (transactions.length > 50) {
      content += `\n... and ${transactions.length - 50} more transactions\n`
    }

    content += `\n${'='.repeat(80)}\n`
    content += `\nEND OF REPORT\n`

    return content
  }

  const generateExcelCSV = (): string => {
    // Enhanced CSV format for Excel
    let csv = 'Report Type:,' + reportType + '\n'
    csv += 'Period:,' + data.dateRange.start + ' - ' + data.dateRange.end + '\n'
    csv += 'Generated:,' + new Date().toLocaleString('id-ID') + '\n'
    csv += '\n'

    // Summary
    const revenue = data.transactions.filter(t => t.type === 'pemasukan').reduce((sum, t) => sum + t.nominal, 0)
    const expenses = data.transactions.filter(t => t.type === 'pengeluaran').reduce((sum, t) => sum + t.nominal, 0)
    
    csv += 'SUMMARY\n'
    csv += 'Metric,Value\n'
    csv += 'Total Revenue,' + revenue + '\n'
    csv += 'Total Expenses,' + expenses + '\n'
    csv += 'Net Profit,' + (revenue - expenses) + '\n'
    csv += 'Transactions,' + data.transactions.length + '\n'
    csv += '\n'

    // Transactions
    csv += 'TRANSACTIONS\n'
    csv += 'Date,Type,Customer,Description,Amount,Category,Payment Method\n'
    
    data.transactions.forEach(t => {
      const date = new Date(t.tanggal || t.createdAt).toLocaleDateString('id-ID')
      csv += `"${date}","${t.type}","${t.customerName || '-'}","${t.keterangan || '-'}",${t.nominal},"${t.kategori || '-'}","${t.payment || '-'}"\n`
    })

    return csv
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case 'pdf': return <FileText className="h-4 w-4" />
      case 'excel': return <FileSpreadsheet className="h-4 w-4" />
      case 'csv': return <FileSpreadsheet className="h-4 w-4" />
      case 'json': return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: ExportJob['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'processing': return 'bg-blue-500 animate-pulse'
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Options
          </CardTitle>
          <CardDescription>
            Pilih format export yang diinginkan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Format Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['csv', 'excel', 'pdf', 'json'] as ExportFormat[]).map(format => (
              <Card
                key={format}
                className={`cursor-pointer transition-all ${
                  selectedFormat === format ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedFormat(format)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-3 rounded-lg ${
                      selectedFormat === format ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {getFormatIcon(format)}
                    </div>
                    <div>
                      <p className="font-medium uppercase text-sm">{format}</p>
                      <p className="text-xs text-muted-foreground">
                        {format === 'csv' && 'Spreadsheet'}
                        {format === 'excel' && 'Enhanced CSV'}
                        {format === 'pdf' && 'Text Document'}
                        {format === 'json' && 'Raw Data'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Export Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => startExport(selectedFormat)}
              className="gap-2 flex-1"
            >
              <Download className="h-4 w-4" />
              Export as {selectedFormat.toUpperCase()}
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>

          {/* Quick Info */}
          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <p className="text-muted-foreground">Transactions</p>
                <p className="font-semibold">{data.transactions.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Products</p>
                <p className="font-semibold">{data.products.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Period</p>
                <p className="font-semibold">
                  {Math.ceil((new Date(data.dateRange.end).getTime() - new Date(data.dateRange.start).getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Format</p>
                <p className="font-semibold uppercase">{selectedFormat}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export History */}
      {exportJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Export History</CardTitle>
            <CardDescription>
              Recent export jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exportJobs.map(job => (
                <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(job.status)}`} />
                    <div>
                      <p className="font-medium text-sm">{job.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {job.createdAt.toLocaleTimeString('id-ID')}
                        {job.size && ` • ${formatFileSize(job.size)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.status === 'processing' && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    )}
                    {job.status === 'completed' && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    <Badge variant={
                      job.status === 'completed' ? 'default' :
                      job.status === 'processing' ? 'secondary' :
                      job.status === 'failed' ? 'destructive' : 'outline'
                    }>
                      {job.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Format Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Format Descriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 border rounded-lg">
              <p className="font-semibold mb-1">📊 CSV</p>
              <p className="text-muted-foreground">
                Standard spreadsheet format. Compatible with Excel, Google Sheets. Best for data analysis.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-semibold mb-1">📈 Excel (Enhanced CSV)</p>
              <p className="text-muted-foreground">
                Enhanced CSV with summary section. Opens directly in Excel with formatting.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-semibold mb-1">📄 PDF (Text)</p>
              <p className="text-muted-foreground">
                Formatted text document. Good for printing and archiving. Read-only format.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-semibold mb-1">🔧 JSON</p>
              <p className="text-muted-foreground">
                Raw structured data. Best for developers, API integration, or custom processing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
