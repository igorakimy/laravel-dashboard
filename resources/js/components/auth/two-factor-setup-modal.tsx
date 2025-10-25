import AlertError from '@/components/alerts/alert-error';
import { GridScanIcon } from '@/components/auth/grid-scan-icon';
import InputError from '@/components/form/input-error';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useClipboard } from '@/hooks/use-clipboard';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { Form } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Check, Copy } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface TwoFactorSetupStepProps {
  qrCodeSvg: string | null;
  manualSetupKey: string | null;
  buttonText: string;
  onNextStep: () => void;
  errors: string[];
}

interface TwoFactorVerificationStepProps {
  onClose: () => void;
  onBack: () => void;
}

interface TwoFactorSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiresConfirmation: boolean;
  twoFactorEnabled: boolean;
  qrCodeSvg: string | null;
  manualSetupKey: string | null;
  clearSetupData: () => void;
  fetchSetupData: () => Promise<void>;
  errors: string[];
}

function TwoFactorSetupStep({
  qrCodeSvg,
  manualSetupKey,
  buttonText,
  onNextStep,
  errors,
}: TwoFactorSetupStepProps) {
  const [copiedText, copy] = useClipboard();
  const IconComponent = copiedText === manualSetupKey ? Check : Copy;

  return (
    <>
      {errors?.length ? (
        <AlertError errors={errors} />
      ) : (
        <>
          <div className="mx-auto flex max-w-md overflow-hidden">
            <div className="border-border mx-auto aspect-square w-64 rounded-lg border">
              <div className="z-10 flex h-full w-full items-center justify-center p-5">
                {qrCodeSvg ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: qrCodeSvg,
                    }}
                  />
                ) : (
                  <Spinner />
                )}
              </div>
            </div>
          </div>

          <div className="flex w-full space-x-5">
            <Button className="w-full" onClick={onNextStep}>
              {buttonText}
            </Button>
          </div>

          <div className="relative flex w-full items-center justify-center">
            <div className="bg-border absolute inset-0 top-1/2 h-px w-full" />
            <span className="bg-card text-muted-foreground relative px-2 py-1">
              или, введите код вручную
            </span>
          </div>

          <div className="flex w-full space-x-2">
            <div className="border-border flex w-full items-stretch overflow-hidden rounded-md border">
              {!manualSetupKey ? (
                <div className="bg-muted flex h-full w-full items-center justify-center p-3">
                  <Spinner />
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    readOnly
                    defaultValue={manualSetupKey}
                    className="bg-background text-foreground h-full w-full px-4 py-2 outline-none"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          if (manualSetupKey) {
                            void copy(manualSetupKey);
                          }
                        }}
                        className="border-border hover:bg-muted border-l px-2.5"
                      >
                        <IconComponent className="w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {IconComponent === Copy ? 'Копировать' : 'Скопировано'}
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function TwoFactorVerificationStep({ onClose, onBack }: TwoFactorVerificationStepProps) {
  const [code, setCode] = useState<string>('');
  const pinInputContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      pinInputContainerRef.current?.querySelector('input')?.focus();
    }, 0);
  }, []);

  return (
    <Form
      action={route('user.two-factor.confirm')}
      method="post"
      onSuccess={() => onClose()}
      resetOnError
      resetOnSuccess
    >
      {({
        processing,
        errors,
      }: {
        processing: boolean;
        errors?: { confirmTwoFactorAuth?: { code?: string } };
      }) => (
        <>
          <div ref={pinInputContainerRef} className="relative w-full space-y-3">
            <div className="itemscenter flex w-full flex-col space-y-3 py-2">
              <InputOTP
                id="otp"
                name="code"
                maxLength={OTP_MAX_LENGTH}
                onChange={setCode}
                disabled={processing}
                pattern={REGEXP_ONLY_DIGITS}
              >
                <InputOTPGroup>
                  {Array.from({ length: OTP_MAX_LENGTH }, (_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <InputError message={errors.confirmTwoFactorAuth?.code} />
            </div>

            <div className="flex w-full space-x-5">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onBack}
                disabled={processing}
              >
                Назад
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={processing || code.length < OTP_MAX_LENGTH}
              >
                Подтвердить
              </Button>
            </div>
          </div>
        </>
      )}
    </Form>
  );
}
export default function TwoFactorSetupModal({
  isOpen,
  onClose,
  requiresConfirmation,
  twoFactorEnabled,
  qrCodeSvg,
  manualSetupKey,
  clearSetupData,
  fetchSetupData,
  errors,
}: TwoFactorSetupModalProps) {
  const [showVerificationStep, setShowVerificationStep] = useState<boolean>(false);

  const modalConfig = useMemo<{ title: string; description: string; buttonText: string }>(() => {
    if (twoFactorEnabled) {
      return {
        title: 'Двухфакторная аутентификация включена',
        description:
          'Двухфакторная аутентификация теперь включена. Отсканируйте QR-код или введите установочный код в приложении для аутентификации',
        buttonText: 'Закрыть',
      };
    }

    if (showVerificationStep) {
      return {
        title: 'Код подтверждения',
        description: 'Введите 6-значный код из приложения для аутентификации',
        buttonText: 'Закрыть',
      };
    }

    return {
      title: 'Включить двухфакторную аутентификацию',
      description:
        'Чтобы завершить включение, отсканируйте QR-код или введите установочный код в приложении для аутентификации',
      buttonText: 'Продолжить',
    };
  }, [twoFactorEnabled, showVerificationStep]);

  const handleModalNextStep = useCallback(() => {
    if (requiresConfirmation) {
      setShowVerificationStep(true);
      return;
    }

    clearSetupData();
    onClose();
  }, [requiresConfirmation, clearSetupData, onClose]);

  const resetModalState = useCallback(() => {
    setShowVerificationStep(false);
    if (twoFactorEnabled) {
      clearSetupData();
    }
  }, [twoFactorEnabled, clearSetupData]);

  useEffect(() => {
    if (!isOpen) {
      resetModalState();
      return;
    }

    if (!qrCodeSvg) {
      void fetchSetupData();
    }
  }, [isOpen, qrCodeSvg, fetchSetupData, resetModalState]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="flex items-center justify-center">
          <GridScanIcon />
          <DialogTitle>{modalConfig.title}</DialogTitle>
          <DialogDescription className="text-center">{modalConfig.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-5">
          {showVerificationStep ? (
            <TwoFactorVerificationStep
              onClose={onClose}
              onBack={() => setShowVerificationStep(false)}
            />
          ) : (
            <TwoFactorSetupStep
              qrCodeSvg={qrCodeSvg}
              manualSetupKey={manualSetupKey}
              buttonText={modalConfig.buttonText}
              onNextStep={handleModalNextStep}
              errors={errors}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
