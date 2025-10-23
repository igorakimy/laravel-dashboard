import TextLink from '@/components/links/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';

interface VerifyEmailProps {
  status?: string;
}

export default function VerifyEmail({ status }: VerifyEmailProps) {
  return (
    <AuthLayout
      title="Верификация email"
      description="Мы отправим письмо cо ссылкой для подтверждения"
    >
      <Head title="Верификация email" />

      {status === 'verification-link-sent' && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          Письмо отправлено. Для продолжения авторизации перейдите по ссылке в письме.
        </div>
      )}

      <Form
        action={route('verification.send')}
        method="post"
        className="mt-3 space-y-6 text-center"
      >
        {({ processing }) => (
          <>
            <Button disabled={processing} variant="secondary">
              {processing && <Spinner />}
              {processing ? 'Отправка...' : 'Отправить письмо для верификации'}
            </Button>

            <TextLink href={route('logout')} className="mx-auto block text-sm">
              Выйти
            </TextLink>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
