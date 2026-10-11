'use client';

import { useMessages } from 'next-intl';

export function useTranslations(namespace?: string) {
  const messages = useMessages() as Record<string, any> | undefined;

  return (key: string): string => {
    if (!messages) return key;
    const scope = namespace ? messages[namespace] : messages;
    if (!scope) return key;

    const parts = key.split('.');
    let current: any = scope;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return key;
      }
    }

    return typeof current === 'string' ? current : key;
  };
}
