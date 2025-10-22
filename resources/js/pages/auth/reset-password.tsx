import InputError from '@/components/form/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';

interface ResetPasswordProps {
  token: string;
  email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
  return (
    <AuthLayout title="Сброс пароля" description="Пожалуйста, введите ваш новый пароль ниже">
      <Head title="Сброс пароля" />

      <Form
        action={route('password.store')}
        method="post"
        transform={(data) => ({ ...data, token, email })}
        resetOnSuccess={['password', 'password_confirmation']}
        className="mt-3"
      >
        {({ processing, errors }) => (
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={email}
                className="mt-1 block w-full"
                readOnly
              />
              <InputError message={errors.email} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Новый пароль</Label>
              <Input
                id="password"
                type="password"
                name="password"
                className="mt-1 block w-full"
                autoFocus
                autoComplete="new-password"
                placeholder="Придумайте новый пароль"
              />
              <InputError message={errors.password} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password_confirmation">Пароль ещё раз</Label>
              <Input
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                autoComplete="new-password"
                className="mt-1 block w-full"
                placeholder="Повторите новый пароль"
              />
              <InputError message={errors.password_confirmation} className="mt-2" />
            </div>

            <Button type="submit" className="mt-2 w-full" disabled={processing}>
              {processing && <Spinner />}
              Сбросить пароль
            </Button>
          </div>
        )}
      </Form>
    </AuthLayout>
  );
}
