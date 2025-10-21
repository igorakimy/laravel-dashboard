import AuthLayout from '@/layouts/auth-layout'
import { Form, Head } from '@inertiajs/react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import InputError from '@/components/form/input-error'
import { Button } from '@/components/ui/button'
import TextLink from '@/components/links/text-link'
import { Spinner } from '@/components/ui/spinner'

export default function Register() {
  return (
    <AuthLayout
      title="Регистрация аккаунта"
      description="Заполните поля ниже, чтобы зарегистрироваться"
    >
      <Head title="Регистрация" />
      <Form
        action={route('register')}
        method="post"
        resetOnSuccess={['password', 'password_confirmation']}
        disableWhileProcessing
        className="flex flex-col gap-6 mt-3"
      >
        {({processing, errors}) => (
          <>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  required
                  autoFocus
                  tabIndex={1}
                  autoComplete="name"
                  placeholder="Полное имя"
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  tabIndex={2}
                  autoComplete="email"
                  placeholder="email@example.com"
                />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  tabIndex={3}
                  autoComplete="new-password"
                  placeholder="Придумайте пароль"
                />
                <InputError message={errors.password} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">Пароль ещё раз</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  required
                  tabIndex={4}
                  autoComplete="new-password"
                  placeholder="Повторите пароль"
                />
                <InputError message={errors.password_confirmation} />
              </div>

              <Button
                type="submit"
                className="mt-2 w-full"
                tabIndex={5}
                data-test="register-user-button"
              >
                {processing && <Spinner />}
                Зарегистрироваться
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Уже зарегистрированы?{' '}
              <TextLink href={route('login')} tabIndex={6}>
                Войти
              </TextLink>
            </div>
          </>
        )}
      </Form>
    </AuthLayout>
  )
}
