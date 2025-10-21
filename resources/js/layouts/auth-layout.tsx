import AuthTemplateLayout from '@/layouts/auth/auth-simple-layout';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export default function AuthLayout({ children, title, description, ...props }: AuthLayoutProps) {
  return (
    <AuthTemplateLayout title={title} description={description} {...props}>
      {children}
    </AuthTemplateLayout>
  );
}
