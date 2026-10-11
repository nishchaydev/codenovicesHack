'use client';

import { defineRouting } from 'next-intl/routing';
import NextLink from 'next/link';
import { useParams, useRouter as useNextRouter, usePathname as useNextPathname } from 'next/navigation';
import React from 'react';

export const locales = ['en', 'hi', 'fr', 'es', 'de', 'ja', 'zh', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
});

export function Link({ href, children, ...props }: any) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const targetHref =
    typeof href === 'string' && !href.startsWith(`/${locale}`)
      ? `/${locale}${href === '/' ? '' : href}`
      : href;

  return React.createElement(NextLink, { href: targetHref, ...props }, children);
}

export function useRouter() {
  const router = useNextRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  return {
    ...router,
    push: (href: string) => {
      const target =
        typeof href === 'string' && !href.startsWith(`/${locale}`)
          ? `/${locale}${href === '/' ? '' : href}`
          : href;
      router.push(target);
    },
    replace: (href: string, options?: { locale?: Locale }) => {
      const targetLocale = options?.locale || locale;
      const target = typeof href === 'string' ? `/${targetLocale}${href === '/' ? '' : href}` : href;
      router.replace(target);
    },
  };
}

export function usePathname() {
  const pathname = useNextPathname();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  if (pathname && pathname.startsWith(`/${locale}`)) {
    return pathname.slice(locale.length + 1) || '/';
  }
  return pathname || '/';
}
