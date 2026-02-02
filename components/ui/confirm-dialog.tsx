import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog"
import { AlertTriangle, Trash2, Info, CheckCircle2, XCircle } from "lucide-react"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  variant?: 'default' | 'destructive' | 'warning' | 'info'
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  onConfirm,
  variant = 'default'
}: ConfirmDialogProps) {
  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <Trash2 className="w-12 h-12 text-destructive mx-auto mb-4" />
      case 'warning':
        return <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
      case 'info':
        return <Info className="w-12 h-12 text-primary mx-auto mb-4" />
      default:
        return <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
    }
  }

  const getActionClass = () => {
    switch (variant) {
      case 'destructive':
        return "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      case 'warning':
        return "bg-orange-500 text-white hover:bg-orange-600"
      default:
        return ""
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="text-center">
          {getIcon()}
          <AlertDialogTitle className="text-center text-xl">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row gap-2 sm:flex-row">
          <AlertDialogCancel className="flex-1 mt-0">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={`flex-1 ${getActionClass()}`}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
