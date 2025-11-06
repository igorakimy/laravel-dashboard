import InputError from '@/components/form/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types';
import { Form, Head, usePage } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useMemo, useState } from 'react';

type AuthConfigContent = {
  title: string;
  description: string;
  toggleText: string;
};

export default function TwoFactorChallenge() {
  const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');

  const { flash } = usePage<SharedData>().props;

  const authConfigContent = useMemo<AuthConfigContent>(() => {
    if (showRecoveryInput) {
      return {
        title: 'Код восстановления',
        description:
          'Пожалуйста, подтвердите доступ к своей учетной записи, введя один из кодов восстановления.',
        toggleText: 'авторизоваться, используя код подтверждения',
      };
    }

    return {
      title: 'Код подтверждения',
      description: 'Введите код, из приложения для аутентификации.',
      toggleText: 'авторизоваться, используя код восстановления',
    };
  }, [showRecoveryInput]);

  const toggleRecoveryMode = (clearErrors: () => void): void => {
    setShowRecoveryInput(!showRecoveryInput);
    clearErrors();
    setCode('');
  };

  return (
    <AuthLayout title={authConfigContent.title} description={authConfigContent.description}>
      <Head title="Двухфакторная аутентификация" />

      <div className="mt-3 space-y-6">
        <Form
          action={showRecoveryInput ? route('two-factor.recovery') : route('two-factor.verify')}
          method="post"
          className="space-y-4"
          resetOnError
          resetOnSuccess={!showRecoveryInput}
        >
          {({ processing, errors, clearErrors }) => (
            <>
              {showRecoveryInput ? (
                <>
                  <Input
                    name="recovery_code"
                    type="text"
                    placeholder="Введите код восстановления"
                    autoFocus={showRecoveryInput}
                    required
                  />
                  <InputError message={errors.recovery_code} />
                  {flash.error && <InputError message={flash.error} />}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3 text-center">
                  <div className="flex w-full items-center justify-center">
                    <InputOTP
                      name="code"
                      maxLength={OTP_MAX_LENGTH}
                      value={code}
                      onChange={(value) => setCode(value)}
                      disabled={processing}
                      pattern={REGEXP_ONLY_DIGITS}
                      autoFocus={!showRecoveryInput}
                    >
                      <InputOTPGroup>
                        {Array.from({ length: OTP_MAX_LENGTH }, (_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <InputError message={errors.code} />
                  {flash.error && <InputError message={flash.error} />}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={(code.length < 6 && !showRecoveryInput) || processing}
              >
                Продолжить
              </Button>

              <div className="text-muted-foreground text-center text-sm">
                <span>или, вы можете</span>
                <button
                  type="button"
                  className="text-foreground cursor-pointer underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                  onClick={() => toggleRecoveryMode(clearErrors)}
                >
                  {authConfigContent.toggleText}
                </button>
              </div>
            </>
          )}
        </Form>
      </div>
    </AuthLayout>
  );
}
