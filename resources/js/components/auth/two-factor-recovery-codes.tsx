import AlertError from '@/components/alerts/alert-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@inertiajs/react';
import { Eye, EyeOff, LockKeyhole, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface TwoFactorRecoveryCodesProps {
  recoveryCodesList: string[];
  fetchRecoveryCodes: () => Promise<void>;
  errors: string[];
}

export default function TwoFactorRecoveryCodes({
  recoveryCodesList,
  fetchRecoveryCodes,
  errors,
}: TwoFactorRecoveryCodesProps) {
  const [codesAreVisible, setCodesAreVisible] = useState<boolean>(false);
  const codesSectionRef = useRef<HTMLDivElement | null>(null);
  const regenerateButtonRef = useRef<HTMLDivElement | null>(null);
  const canRegenerateCodes = recoveryCodesList.length > 0 && codesAreVisible;

  const toggleCodesVisibility = useCallback(async () => {
    if (!codesAreVisible && !recoveryCodesList.length) {
      await fetchRecoveryCodes();
    }

    setCodesAreVisible(!codesAreVisible);

    if (!codesAreVisible) {
      setTimeout(() => {
        codesSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      });
    }
  }, [codesAreVisible, recoveryCodesList.length, fetchRecoveryCodes]);

  useEffect(() => {
    if (!recoveryCodesList.length) {
      void fetchRecoveryCodes();
    }
  }, [recoveryCodesList.length, fetchRecoveryCodes]);

  const RecoveryCodeIconComponent = codesAreVisible ? EyeOff : Eye;

  const focusOnRegenerateButton = () => {
    regenerateButtonRef.current?.focus();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-3">
          <LockKeyhole className="size-4" aria-hidden="true" />
          Коды восстановления 2FA
        </CardTitle>
        <CardDescription>
          Коды восстановления позволяют восстановить доступ, если вы потеряете 2FA-устройство.
          Сохраните их в безопасном месте.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 select-none sm:flex-row sm:items-center sm:justify-between">
          <Button
            onClick={toggleCodesVisibility}
            className="w-fit"
            aria-expanded={codesAreVisible}
            aria-controls="recovery-codes-section"
          >
            <RecoveryCodeIconComponent className="size-4" aria-hidden="true" />
            {codesAreVisible ? 'Скрыть' : 'Показать'} коды восстановления
          </Button>

          {canRegenerateCodes && (
            <Form
              action={route('user.two-factor.recovery.generate')}
              method="post"
              options={{
                preserveScroll: true,
              }}
              onSuccess={() => {
                void fetchRecoveryCodes();
              }}
            >
              {({ processing }) => (
                <Button
                  ref={regenerateButtonRef}
                  variant="secondary"
                  type="submit"
                  disabled={processing}
                  aria-describedby="regenerate-warning"
                  className="focus:ring-2 ring-ring"
                >
                  <RefreshCw />
                  Перегенерировать коды
                </Button>
              )}
            </Form>
          )}
        </div>

        <div
          id="recovery-codes-section"
          className={`relative overflow-hidden transition-all duration-300 ${codesAreVisible ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}
          aria-hidden={!codesAreVisible}
        >
          <div className="mt-3 space-y-3">
            {errors?.length ? (
              <AlertError errors={errors} />
            ) : (
              <>
                <div
                  ref={codesSectionRef}
                  className="bg-muted grid gap-1 rounded-lg p-4 font-mono text-sm"
                  role="list"
                  aria-label="Коды восстановления"
                >
                  {recoveryCodesList.length ? (
                    recoveryCodesList.map((code, index) => (
                      <div key={index} role="listitem" className="select-text">
                        {code}
                      </div>
                    ))
                  ) : (
                    <div className="space-y-2" aria-label="Загрузка кодов восстановления">
                      {Array.from({ length: 8 }, (_, index) => (
                        <div
                          key={index}
                          className="bg-muted-foreground/20 h-4 animate-pulse rounded"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-muted-foreground text-xs select-none">
                  <p id="regenerate-warning">
                    Каждый код восстановления можно использовать только один раз для доступа к вашей
                    учетной записи, после чего он будет удалён. Если вам нужно больше кодов, то
                    кликните по кнопке <span onClick={() => focusOnRegenerateButton()} className="font-bold cursor-pointer">Перегенерировать коды</span>{' '}
                    выше.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
