import InputError from '@/components/form/input-error';
import TextLink from '@/components/links/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';
import SocialButtons from '@/components/auth/social-buttons';

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  return (
    <AuthLayout title="Вход в аккаунт" description="Введите email и пароль ниже, чтобы войти">
      <Head title="Вход" />

      <Form
        action={route('login')}
        method="post"
        resetOnSuccess={['password']}
        className="mt-3 flex flex-col gap-6"
      >
        {({ processing, errors }) => (
          <>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoFocus
                  tabIndex={1}
                  autoComplete="email"
                  placeholder="email@example.com"
                />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Пароль</Label>
                  {canResetPassword && (
                    <TextLink
                      href={route('password.forgot')}
                      className="ml-auto text-sm"
                      tabIndex={5}
                    >
                      Забыли пароль?
                    </TextLink>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  tabIndex={2}
                  autoComplete="current-password"
                  placeholder="Пароль"
                />
                <InputError message={errors.password} />
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox id="remember" name="rememeber" tabIndex={3} />
                <Label htmlFor="remember">Запомнить меня</Label>
              </div>

              <Button>
                {processing && <Spinner />}
                Войти
              </Button>
            </div>

            <SocialButtons />

            <div className="text-muted-foreground text-center text-sm">
              Не зарегистрированы?{' '}
              <TextLink href={'/register'} tabIndex={5}>
                Зарегистрироваться
              </TextLink>
            </div>
          </>
        )}
      </Form>

      {status && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>
      )}
    </AuthLayout>
  );
}
