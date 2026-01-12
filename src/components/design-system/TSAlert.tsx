import * as React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { cva } from 'class-variance-authority';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const customAlertVariants = cva('', {
  variants: {
    status: {
      error: 'bg-red-50 text-red-900 border-red-200',
      warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
      success: 'bg-green-50 text-green-900 border-green-200',
    },
  },
  defaultVariants: {
    status: 'success',
  },
});

const iconMap = {
  error: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle,
};

export interface CustomAlertProps extends React.ComponentProps<'div'> {
  status?: 'error' | 'warning' | 'success';
  message: string;
}

export const TSAlert: React.FC<CustomAlertProps> = ({
  className,
  status = 'success',
  message,
  ...props
}) => {
  const IconComponent = iconMap[status];

  const iconColorClass = {
    error: 'text-red-600',
    warning: 'text-yellow-600',
    success: 'text-green-600',
  }[status];

  return (
    <Alert
      className={cn(customAlertVariants({ status }), className)}
      {...props}
    >
      <IconComponent className={cn('size-4', iconColorClass)} />
      <AlertDescription className="font-medium text-current">
        {message}
      </AlertDescription>
    </Alert>
  );
};
