import TwoFactorRecoveryCodes from '@/components/auth/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/auth/two-factor-setup-modal';
import HeadingSmall from '@/components/common/heading-small';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import AppLayout from '@/layouts/app-layout';
import UserProfileLayout from '@/layouts/user/user-profile-layout';
import { BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface TwoFactorProps {
  requireConfirmation?: boolean;
  twoFactorEnabled?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Двухфакторная аутентификация',
    href: route('user.two-factor'),
  },
];

export default function TwoFactor({
  requireConfirmation = false,
  twoFactorEnabled = false,
}: TwoFactorProps) {
  const {
    qrCodeSvg,
    hasSetupData,
    manualSetupKey,
    clearSetupData,
    fetchSetupData,
    recoveryCodesList,
    fetchRecoveryCodes,
    errors,
  } = useTwoFactorAuth();

  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Двухфакторная аутентификация" />

      <UserProfileLayout>
        <div className="space-y-6">
          <HeadingSmall title="Двухфакторная аутентификация" />

          {twoFactorEnabled ? (
            <div className="flex flex-col items-start justify-start space-y-4">
              <Badge variant="secondary" className="bg-green-500 text-white dark:bg-green-600">
                Включена
              </Badge>
              <p className="text-muted-foreground">
                Если двухфакторная аутентификация включена, вам будет предложено ввести безопасный
                случайный PIN-код во время входа в аккаунт, который вы можете получить из приложения
                с поддержкой TOTP на вашем телефоне или другом устройстве.
              </p>

              <TwoFactorRecoveryCodes
                recoveryCodesList={recoveryCodesList}
                fetchRecoveryCodes={fetchRecoveryCodes}
                errors={errors}
              />

              <div className="relative inline">
                <Form action={route('user.two-factor.disable')} method="delete">
                  {({ proccessing }) => (
                    <Button variant="destructive" type="submit" disabled={proccessing}>
                      <ShieldBan />
                      Отключить 2FA
                    </Button>
                  )}
                </Form>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start justify-start space-y-4">
              <Badge variant="destructive" className="text-white">
                Отключена
              </Badge>
              <p className="text-muted-foreground">
                Если двухфакторная аутентификация включена, вам будет предложено ввести безопасный
                случайный PIN-код во время входа в аккаунт, который вы можете получить из приложения
                с поддержкой TOTP на вашем телефоне или другом устройстве.
              </p>

              <div>
                {hasSetupData ? (
                  <Button onClick={() => setShowSetupModal(true)}>
                    <ShieldCheck />
                    Продолжить настройку
                  </Button>
                ) : (
                  <Form
                    action={route('user.two-factor.enable')}
                    method="post"
                    onSuccess={() => setShowSetupModal(true)}
                  >
                    {({ processing }) => (
                      <Button type="submit" disabled={processing}>
                        <ShieldCheck />
                        Включить 2FA
                      </Button>
                    )}
                  </Form>
                )}
              </div>
            </div>
          )}

          <TwoFactorSetupModal
            isOpen={showSetupModal}
            onClose={() => setShowSetupModal(false)}
            requiresConfirmation={requireConfirmation || false}
            twoFactorEnabled={twoFactorEnabled || false}
            qrCodeSvg={qrCodeSvg}
            manualSetupKey={manualSetupKey}
            clearSetupData={clearSetupData}
            fetchSetupData={fetchSetupData}
            errors={errors}
          />
        </div>
      </UserProfileLayout>
    </AppLayout>
  );
}
