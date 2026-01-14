'use client'

import { cn } from '@/lib/utils'

type AlertVariant = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<AlertVariant, string> = {
  success: 'border-green-200 bg-green-50 text-green-700',
  error: 'border-red-200 bg-red-50 text-red-700',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
}

export function Alert({
  variant = 'info',
  title,
  children,
  className,
}: AlertProps) {
  return (
    <div
      className={cn(
        'mb-4 rounded-lg border px-4 py-3 text-sm',
        variantStyles[variant],
        className
      )}
    >
      {title && <div className="font-semibold mb-1">{title}</div>}
      {children}
    </div>
  )
}
