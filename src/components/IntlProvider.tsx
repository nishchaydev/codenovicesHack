'use client';

import { NextIntlClientProvider } from 'next-intl';
import React from 'react';

export function IntlProvider({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: any;
  children: React.ReactNode;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  );
}
