import '../css/app.css';

import { initializeTheme } from '@/hooks/use-appearance';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';

declare global {
  const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

void createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
  setup: function ({ el, App, props }) {
    const root = createRoot(el);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    root.render(<App {...props} />);
  },
  progress: {
    color: '#4B5563',
  },
});

// Инициализация темы (установка светлой/тёмной темы при загрузке)...
initializeTheme();
