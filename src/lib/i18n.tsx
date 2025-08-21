import React, {createContext, useContext} from 'react';
import enHero from '../../locales/en/hero.json';
import enAbout from '../../locales/en/about.json';
import enContact from '../../locales/en/contact.json';
import enProjectsQA from '../../locales/en/projectsQA.json';
import enProjectsGames from '../../locales/en/projectsGames.json';
import esHero from '../../locales/es/hero.json';
import esAbout from '../../locales/es/about.json';
import esContact from '../../locales/es/contact.json';
import esProjectsQA from '../../locales/es/projectsQA.json';
import esProjectsGames from '../../locales/es/projectsGames.json';

const messages = {
  en: {hero: enHero, about: enAbout, contact: enContact, projectsQA: enProjectsQA, projectsGames: enProjectsGames},
  es: {hero: esHero, about: esAbout, contact: esContact, projectsQA: esProjectsQA, projectsGames: esProjectsGames}
};

type Locale = keyof typeof messages;

type I18nContextValue = {locale: Locale};

const I18nContext = createContext<I18nContextValue>({locale: 'es'});

export function I18nProvider({locale = 'es', children}: {locale?: Locale; children: React.ReactNode}) {
  return <I18nContext.Provider value={{locale}}>{children}</I18nContext.Provider>;
}

function getMessage(obj: any, path: string): any {
  return path.split('.').reduce((o, key) => (o ? o[key] : undefined), obj);
}

export function useTranslations(section: keyof typeof messages['en']) {
  const {locale} = useContext(I18nContext);
  return function translate(key: string, vars?: Record<string, string>) {
    const msg = getMessage(messages[locale][section], key);
    if (typeof msg === 'string') {
      return msg.replace(/\{(\w+)\}/g, (_, name) => vars?.[name] ?? '');
    }
    return msg;
  };
}
