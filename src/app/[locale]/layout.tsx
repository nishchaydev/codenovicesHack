import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/components/AuthProvider';
import { IntlProvider } from '@/components/IntlProvider';

import enMessages from '../../../messages/en.json';
import hiMessages from '../../../messages/hi.json';
import frMessages from '../../../messages/fr.json';
import esMessages from '../../../messages/es.json';
import deMessages from '../../../messages/de.json';
import jaMessages from '../../../messages/ja.json';
import zhMessages from '../../../messages/zh.json';
import arMessages from '../../../messages/ar.json';

const allMessages: Record<string, any> = {
  en: enMessages,
  hi: hiMessages,
  fr: frMessages,
  es: esMessages,
  de: deMessages,
  ja: jaMessages,
  zh: zhMessages,
  ar: arMessages,
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = allMessages[locale] || enMessages;

  return (
    <AuthProvider>
      <IntlProvider locale={locale} messages={messages}>
        <ThemeProvider>
          <div className="min-h-screen bg-clay-bg/40 text-clay-text transition-colors duration-300">
            {children}
          </div>
        </ThemeProvider>
      </IntlProvider>
    </AuthProvider>
  );
}

