// OriginalName: AdvancedReportsBuilder
// ShortName: AdvReports

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  FileBarChart,
  Printer,
  Mail,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import type { Transaction } from '../../types/financial'
import type { Product } from '../../types/inventory'
import type { NotaService } from '../../types/nota'
import { useNotaStore } from '../../hooks/useNotaStore'

interface AdvReportsProps {
  transactions: Transaction[]
  products: Product[]
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: 'financial' | 'inventory' | 'service' | 'customer'
  sections: string[]
  icon: any
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'monthly-financial',
    name: 'Laporan Keuangan Bulanan',
    description: 'Comprehensive monthly financial report dengan profit/loss analysis',
    category: 'financial',
    sections: ['revenue', 'expenses', 'profit', 'trends', 'breakdown'],
    icon: DollarSign
  },
  {
    id: 'inventory-valuation',
    name: 'Valuasi Inventory',
    description: 'Stock value, turnover rate, dead stock analysis',
    category: 'inventory',
    sections: ['stock-value', 'turnover', 'dead-stock', 'reorder'],
    icon: Package
  },
  {
    id: 'service-performance',
    name: 'Service Performance Report',
    description: 'Repair statistics, success rate, popular issues',
    category: 'service',
    sections: ['total-service', 'brand-analysis', 'repair-types', 'quality'],
    icon: FileBarChart
  },
  {
    id: 'customer-analysis',
    name: 'Customer Analytics',
    description: 'Customer behavior, repeat customers, revenue per customer',
    category: 'customer',
    sections: ['total-customers', 'repeat-rate', 'avg-revenue', 'segments'],
    icon: Users
  },
  {
    id: 'product-performance',
    name: 'Product Performance',
    description: 'Best sellers, slow movers, margin analysis by product',
    category: 'inventory',
    sections: ['best-sellers', 'slow-movers', 'margin-analysis', 'recommendations'],
    icon: TrendingUp
  },
  {
    id: 'custom',
    name: 'Custom Report',
    description: 'Build your own report dengan custom metrics',
    category: 'financial',
    sections: [],
    icon: FileText
  }
]

export function AdvReports({ transactions, products }: AdvReportsProps) {
  const { getServiceNota } = useNotaStore()
  const allServices = getServiceNota()

  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of month
    end: new Date().toISOString().split('T')[0]
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Filter data by date range
  const filteredData = useMemo(() => {
    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)
    endDate.setHours(23, 59, 59, 999) // End of day

    return {
      transactions: transactions.filter(t => {
        const txDate = new Date(t.tanggal || t.createdAt)
        return txDate >= startDate && txDate <= endDate
      }),
      services: allServices.filter(s => {
        const sDate = new Date(s.tanggal)
        return sDate >= startDate && sDate <= endDate
      })
    }
  }, [transactions, allServices, dateRange])

  // Calculate report metrics based on template
  const reportMetrics = useMemo(() => {
    const { transactions: txs, services } = filteredData

    // Financial metrics
    const revenue = txs.filter(t => t.type === 'pemasukan').reduce((sum, t) => sum + t.nominal, 0)
    const expenses = txs.filter(t => t.type === 'pengeluaran').reduce((sum, t) => sum + t.nominal, 0)
    const profit = revenue - expenses
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0

    // Inventory metrics
    const totalStockValue = products.reduce((sum, p) => sum + (p.cost * p.stock), 0)
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= (p.minStock || 5)).length
    const outOfStock = products.filter(p => p.stock === 0).length

    // Service metrics
    const totalServices = services.length
    const completedServices = services.filter(s => s.status === 'Selesai' || s.status === 'Diambil').length
    const serviceSuccessRate = totalServices > 0 ? (completedServices / totalServices) * 100 : 0

    // Customer metrics
    const uniqueCustomers = new Set(txs.filter(t => t.customerName).map(t => t.customerName)).size
    const avgRevPerCustomer = uniqueCustomers > 0 ? revenue / uniqueCustomers : 0

    // Product performance
    const productSales: Record<string, { qty: number; revenue: number; cost: number }> = {}
    txs.filter(t => t.type === 'pemasukan' && t.items).forEach(t => {
      t.items!.forEach(item => {
        const key = item.productName || item.productId || 'Unknown'
        if (!productSales[key]) {
          productSales[key] = { qty: 0, revenue: 0, cost: 0 }
        }
        productSales[key].qty += item.quantity
        productSales[key].revenue += item.unitPrice * item.quantity
        productSales[key].cost += item.unitCost * item.quantity
      })
    })

    const bestSellers = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10)

    return {
      financial: { revenue, expenses, profit, margin },
      inventory: { totalStockValue, lowStock, outOfStock },
      service: { totalServices, completedServices, serviceSuccessRate },
      customer: { uniqueCustomers, avgRevPerCustomer },
      products: { bestSellers }
    }
  }, [filteredData, products])

  const generateReport = async (format: 'pdf' | 'excel' | 'print') => {
    setIsGenerating(true)

    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (format === 'pdf') {
      // In real implementation, use jsPDF or similar
      const reportContent = generateReportContent()
      downloadAsText(reportContent, `report-${selectedTemplate}-${Date.now()}.txt`)
    } else if (format === 'excel') {
      // In real implementation, use xlsx library
      const csvContent = generateCSVContent()
      downloadAsText(csvContent, `report-${selectedTemplate}-${Date.now()}.csv`)
    } else if (format === 'print') {
      window.print()
    }

    setIsGenerating(false)
  }

  const generateReportContent = () => {
    const template = REPORT_TEMPLATES.find(t => t.id === selectedTemplate)
    if (!template) return ''

    let content = `${template.name}\n`
    content += `Periode: ${dateRange.start} s/d ${dateRange.end}\n`
    content += `Generated: ${new Date().toLocaleString('id-ID')}\n`
    content += `\n${'='.repeat(60)}\n\n`

    if (template.category === 'financial') {
      content += `FINANCIAL SUMMARY\n\n`
      content += `Total Revenue: ${formatCurrency(reportMetrics.financial.revenue)}\n`
      content += `Total Expenses: ${formatCurrency(reportMetrics.financial.expenses)}\n`
      content += `Net Profit: ${formatCurrency(reportMetrics.financial.profit)}\n`
      content += `Profit Margin: ${reportMetrics.financial.margin.toFixed(2)}%\n`
    }

    if (template.category === 'inventory') {
      content += `\nINVENTORY SUMMARY\n\n`
      content += `Total Stock Value: ${formatCurrency(reportMetrics.inventory.totalStockValue)}\n`
      content += `Low Stock Items: ${reportMetrics.inventory.lowStock}\n`
      content += `Out of Stock Items: ${reportMetrics.inventory.outOfStock}\n`
    }

    if (template.category === 'service') {
      content += `\nSERVICE SUMMARY\n\n`
      content += `Total Services: ${reportMetrics.service.totalServices}\n`
      content += `Completed: ${reportMetrics.service.completedServices}\n`
      content += `Success Rate: ${reportMetrics.service.serviceSuccessRate.toFixed(2)}%\n`
    }

    if (template.category === 'customer') {
      content += `\nCUSTOMER SUMMARY\n\n`
      content += `Unique Customers: ${reportMetrics.customer.uniqueCustomers}\n`
      content += `Avg Revenue/Customer: ${formatCurrency(reportMetrics.customer.avgRevPerCustomer)}\n`
    }

    content += `\n${'='.repeat(60)}\n`
    content += `\nBEST SELLING PRODUCTS\n\n`
    reportMetrics.products.bestSellers.forEach((product, i) => {
      content += `${i + 1}. ${product.name}\n`
      content += `   Qty: ${product.qty} | Revenue: ${formatCurrency(product.revenue)}\n`
    })

    return content
  }

  const generateCSVContent = () => {
    let csv = 'Category,Metric,Value\n'
    
    csv += `Financial,Revenue,${reportMetrics.financial.revenue}\n`
    csv += `Financial,Expenses,${reportMetrics.financial.expenses}\n`
    csv += `Financial,Profit,${reportMetrics.financial.profit}\n`
    csv += `Financial,Margin %,${reportMetrics.financial.margin}\n`
    
    csv += `Inventory,Stock Value,${reportMetrics.inventory.totalStockValue}\n`
    csv += `Inventory,Low Stock,${reportMetrics.inventory.lowStock}\n`
    csv += `Inventory,Out of Stock,${reportMetrics.inventory.outOfStock}\n`
    
    csv += `Service,Total,${reportMetrics.service.totalServices}\n`
    csv += `Service,Completed,${reportMetrics.service.completedServices}\n`
    csv += `Service,Success Rate %,${reportMetrics.service.serviceSuccessRate}\n`

    return csv
  }

  const downloadAsText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Advanced Reports
        </h2>
        <p className="text-sm text-muted-foreground">
          Generate comprehensive business reports dengan berbagai format export
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Revenue</span>
            </div>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(reportMetrics.financial.revenue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Profit</span>
            </div>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(reportMetrics.financial.profit)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Stock Value</span>
            </div>
            <p className="text-xl font-bold">
              {formatCurrency(reportMetrics.inventory.totalStockValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Customers</span>
            </div>
            <p className="text-xl font-bold">
              {reportMetrics.customer.uniqueCustomers}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="preview">Preview & Export</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Report Template</CardTitle>
              <CardDescription>
                Pilih template report yang ingin di-generate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date Range Filter */}
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Date Range</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Start Date</label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-md mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">End Date</label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-md mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Template Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REPORT_TEMPLATES.map(template => {
                  const Icon = template.icon
                  const isSelected = selectedTemplate === template.id

                  return (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            }`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{template.name}</h4>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {template.category}
                              </Badge>
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                        {template.sections.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {template.sections.slice(0, 3).map(section => (
                              <Badge key={section} variant="secondary" className="text-xs">
                                {section}
                              </Badge>
                            ))}
                            {template.sections.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{template.sections.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {!selectedTemplate && (
                <div className="p-6 border rounded-lg border-dashed text-center">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Pilih report template untuk melanjutkan
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview & Export Tab */}
        <TabsContent value="preview" className="space-y-4">
          {selectedTemplate ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        {REPORT_TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                      </CardTitle>
                      <CardDescription>
                        Periode: {new Date(dateRange.start).toLocaleDateString('id-ID')} - {new Date(dateRange.end).toLocaleDateString('id-ID')}
                      </CardDescription>
                    </div>
                    <Badge>
                      {filteredData.transactions.length} transactions
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Financial Section */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Financial Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(reportMetrics.financial.revenue)}
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Expenses</p>
                        <p className="text-xl font-bold text-red-600">
                          {formatCurrency(reportMetrics.financial.expenses)}
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Profit</p>
                        <p className="text-xl font-bold text-blue-600">
                          {formatCurrency(reportMetrics.financial.profit)}
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Margin</p>
                        <p className="text-xl font-bold">
                          {reportMetrics.financial.margin.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Best Sellers */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Top 10 Best Sellers
                    </h3>
                    <div className="space-y-2">
                      {reportMetrics.products.bestSellers.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                              <span className="font-bold text-sm">#{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.qty} pcs sold</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(product.revenue)}</p>
                            <p className="text-sm text-green-600">
                              +{formatCurrency(product.revenue - product.cost)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Export Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Export Report</CardTitle>
                  <CardDescription>
                    Download atau print report dalam berbagai format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => generateReport('pdf')}
                      disabled={isGenerating}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export as TXT
                    </Button>
                    <Button
                      onClick={() => generateReport('excel')}
                      disabled={isGenerating}
                      variant="outline"
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export as CSV
                    </Button>
                    <Button
                      onClick={() => generateReport('print')}
                      disabled={isGenerating}
                      variant="outline"
                      className="gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      Print Report
                    </Button>
                  </div>
                  {isGenerating && (
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      Generating report...
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="font-medium mb-2">No Template Selected</p>
                <p className="text-sm text-muted-foreground">
                  Pilih report template terlebih dahulu di tab Templates
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
