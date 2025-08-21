import {NextIntlClientProvider as NextIntlProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import type {ReactNode} from 'react';
import React from 'react';

const dictionaries = {
  en: () => import('@/messages/en.json').then((m) => m.default),
  es: () => import('@/messages/es.json').then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;

export async function getMessages(locale: Locale) {
  const loader = dictionaries[locale];
  if (!loader) {
    notFound();
  }
  return loader();
}

export async function I18nProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  const messages = await getMessages(locale);
  return React.createElement(
    NextIntlProvider as unknown as React.ComponentType<any>,
    { locale, messages },
    children
  );
}
