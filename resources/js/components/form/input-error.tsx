import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface InputErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

export default function InputError({ message, className = '', ...props }: InputErrorProps) {
  return message ? (
    <p {...props} className={cn('text-sm text-red-600 dark:text-red-400', className)}>
      {message}
    </p>
  ) : null;
}
