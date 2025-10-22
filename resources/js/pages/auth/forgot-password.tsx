import InputError from '@/components/form/input-error';
import TextLink from '@/components/links/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';

interface ForgotPasswordProps {
  status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
  return (
    <AuthLayout
      title="Забыли пароль?"
      description="Введите email, чтобы получить ссылку для сброса пароля"
    >
      <Head title="Забыли пароль" />

      {status && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>
      )}

      <div className="mt-3 space-y-6">
        <Form action={route('password.email')} method="post">
          {({ processing, errors }) => (
            <>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="off"
                  autoFocus
                  placeholder="email@example.com"
                />
                <InputError message={errors.email} />
              </div>

              <div className="my-6 flex items-center justify-start">
                <Button className="w-full" disabled={processing}>
                  {processing && <Spinner />}
                  Получить ссылку для сброса пароля
                </Button>
              </div>
            </>
          )}
        </Form>

        <div className="text-muted-foreground space-x-1 text-center text-sm">
          <span>или, вернуться на страницу</span>
          <TextLink href={route('login')}>входа</TextLink>
        </div>
      </div>
    </AuthLayout>
  );
}
