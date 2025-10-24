import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

interface AlertErrorProps {
  errors: string[];
  title?: string;
}

export default function AlertError({ errors, title }: AlertErrorProps) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{title || 'Что-то пошло не так...'}</AlertTitle>
      <AlertDescription>
        <ul className="list-inside list-disc text-sm">
          {Array.from(new Set(errors)).map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
