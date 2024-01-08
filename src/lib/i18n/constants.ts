import locales from '@/locales/index.js';

export type Language = {
  key: keyof typeof locales;
  dir?: 'ltr' | 'rtl';
  fontScale?: number;
};

export const DEFAULT_NAMESPACE = 'main';

export const DEFAULT_LANGUAGE_KEY: Language['key'] = 'es';

export const AVAILABLE_LANGUAGES: Language[] = [
  {
    key: 'en',
  },
  {
    key: 'fr',
  },
  {
    key: 'ar',
    dir: 'rtl',
    fontScale: 1.2,
  },
  {
    key: 'es',
  },
  {
    key: 'it',
  },
];
