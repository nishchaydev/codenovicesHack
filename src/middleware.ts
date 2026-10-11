import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'hi', 'fr', 'es', 'de', 'ja', 'zh', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export const config = {
  matcher: ['/', '/(ar|de|en|es|fr|hi|ja|zh)/:path*'],
};
