import { cn } from './utils'

interface CurrencyDisplayProps {
  amount: number
  type?: 'sales' | 'expense' | 'profit' | 'debt' | 'neutral'
  className?: string
  showSign?: boolean
}

export function CurrencyDisplay({ 
  amount, 
  type = 'neutral', 
  className,
  showSign = false 
}: CurrencyDisplayProps) {
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(Math.abs(amount))

  const colorClass = {
    sales: 'text-sales',
    expense: 'text-expense',
    profit: 'text-profit',
    debt: 'text-debt',
    neutral: 'text-foreground'
  }[type]

  const sign = showSign && amount !== 0 ? (amount > 0 ? '+' : '-') : ''

  return (
    <span className={cn(colorClass, className)}>
      {sign}{formatted}
    </span>
  )
}

interface PercentDisplayProps {
  value: number
  className?: string
  showSign?: boolean
  colorize?: boolean
}

export function PercentDisplay({ 
  value, 
  className,
  showSign = true,
  colorize = true
}: PercentDisplayProps) {
  const sign = showSign && value !== 0 ? (value > 0 ? '+' : '') : ''
  
  const colorClass = colorize 
    ? (value >= 0 ? 'text-success' : 'text-destructive')
    : 'text-foreground'

  return (
    <span className={cn(colorClass, className)}>
      {sign}{value.toFixed(1)}%
    </span>
  )
}

interface NumberDisplayProps {
  value: number
  type?: 'sales' | 'expense' | 'profit' | 'debt' | 'neutral'
  className?: string
  showSign?: boolean
  suffix?: string
}

export function NumberDisplay({ 
  value, 
  type = 'neutral',
  className,
  showSign = false,
  suffix = ''
}: NumberDisplayProps) {
  const colorClass = {
    sales: 'text-sales',
    expense: 'text-expense',
    profit: 'text-profit',
    debt: 'text-debt',
    neutral: 'text-foreground'
  }[type]

  const sign = showSign && value !== 0 ? (value > 0 ? '+' : '') : ''

  return (
    <span className={cn(colorClass, className)}>
      {sign}{value.toLocaleString('id-ID')}{suffix}
    </span>
  )
}
