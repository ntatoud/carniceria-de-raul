import locales from '@/locales/index.js';
import { DEFAULT_NAMESPACE } from '@/lib/i18n/constants.js';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: typeof DEFAULT_NAMESPACE;
    resources: (typeof locales)['en'];
  }
}

export {};
