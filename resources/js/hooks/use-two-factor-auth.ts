import { useCallback, useMemo, useState } from 'react';

interface TwoFactorSetupData {
  svg: string;
  url: string;
}

interface TwoFactorSecretKey {
  secretKey: string;
}

export const OTP_MAX_LENGTH = 6;

const routes = {
  qrCodeRoute: route('user.two-factor.qrcode'),
  secretKey: route('user.two-factor.secret'),
  recoveryCodes: route('user.two-factor.recovery.show'),
};

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Ошибка получения ответа: ${response.status}`);
  }

  return response.json();
};

export const useTwoFactorAuth = () => {
  const [qrCodeSvg, setQrCodeSvg] = useState<string | null>(null);
  const [manualSetupKey, setManualSetupKey] = useState<string | null>(null);
  const [recoveryCodesList, setRecoveryCodesList] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const hasSetupData = useMemo<boolean>(
    () => qrCodeSvg !== null && manualSetupKey !== null,
    [qrCodeSvg, manualSetupKey],
  );

  const fetchQrCode = useCallback(async (): Promise<void> => {
    try {
      const { svg } = await fetchJson<TwoFactorSetupData>(routes.qrCodeRoute);
      setQrCodeSvg(svg);
    } catch {
      setErrors((prev) => [...prev, 'Ошибка получения QR-кода']);
      setQrCodeSvg(null);
    }
  }, []);

  const fetchSetupKey = useCallback(async (): Promise<void> => {
    try {
      const { secretKey: key } = await fetchJson<TwoFactorSecretKey>(routes.secretKey);
      setManualSetupKey(key);
    } catch {
      setErrors((prev) => [...prev, 'Ошибка получения ключа установки']);
      setManualSetupKey(null);
    }
  }, []);

  const clearErrors = useCallback((): void => {
    setErrors([]);
  }, []);

  const clearSetupData = useCallback((): void => {
    setManualSetupKey(null);
    setQrCodeSvg(null);
    clearErrors();
  }, [clearErrors]);

  const fetchRecoveryCodes = useCallback(async (): Promise<void> => {
    try {
      clearErrors();
      const codes = await fetchJson<string[]>(routes.recoveryCodes);
      setRecoveryCodesList(codes);
    } catch {
      setErrors((prev) => [...prev, 'Ошибка получения кодов восстановления']);
      setRecoveryCodesList([]);
    }
  }, [clearErrors]);

  const fetchSetupData = useCallback(async (): Promise<void> => {
    try {
      clearErrors();
      await Promise.all([fetchQrCode(), fetchSetupKey()]);
    } catch {
      setQrCodeSvg(null);
      setManualSetupKey(null);
    }
  }, [clearErrors, fetchQrCode, fetchSetupKey]);

  return {
    qrCodeSvg,
    manualSetupKey,
    recoveryCodesList,
    hasSetupData,
    errors,
    clearErrors,
    clearSetupData,
    fetchQrCode,
    fetchSetupKey,
    fetchSetupData,
    fetchRecoveryCodes,
  };
};
