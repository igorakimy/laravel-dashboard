import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const prefersDark = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365) => {
  if (typeof document === 'undefined') {
    return;
  }

  const maxAge = days * 24 * 60 * 60; // Время жизни (в секундах)
  document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const applyTheme = (appearance: Appearance) => {
  const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());

  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

const mediaQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

const handleSystemThemeChange = () => {
  const currentAppearance = localStorage.getItem('appearance') as Appearance;
  applyTheme(currentAppearance || 'system');
};

export function initializeTheme() {
  const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'system';

  applyTheme(savedAppearance);

  // Добавить слушатель событий для изменения системной темы...
  mediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
  const [appearance, setAppearance] = useState<Appearance>('system');

  const updateAppearance = useCallback((mode: Appearance) => {
    setAppearance(mode);

    // Сохранить в localStorage для хранения на стороне клиента...
    localStorage.setItem('appearance', mode);

    // Сохранить куки для SSR...
    setCookie('appearance', mode);

    applyTheme(mode);
  }, []);

  useEffect(() => {
    const savedAppearance = localStorage.getItem('appearance') as Appearance | null;

    updateAppearance(savedAppearance || 'system');

    return () => mediaQuery()?.removeEventListener('change', handleSystemThemeChange);
  }, [updateAppearance]);

  return { appearance, updateAppearance } as const;
}
