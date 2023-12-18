import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';
import { DEFAULT_LANGUAGE_KEY, DEFAULT_NAMESPACE } from './constants.js';
import locales from '../../locales/index.js';
i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
    defaultNS: DEFAULT_NAMESPACE,
    ns: Object.keys(locales[DEFAULT_LANGUAGE_KEY]),
    resources: locales,
    lng: DEFAULT_LANGUAGE_KEY,
    fallbackLng: DEFAULT_LANGUAGE_KEY,
});
export default i18next;
