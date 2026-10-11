export const locales = ['en', 'hi', 'fr', 'es', 'de', 'ja', 'zh', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';
