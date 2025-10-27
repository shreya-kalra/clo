import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';

const resources = {
  en: {
    translation: en,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  react: {
    useSuspense: false,
  },
  interpolation: {
    escapeValue: false,
  },
});

type EnLangType = typeof en;

type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `${TKey}`
  >;
}[keyof TObj & (string | number)];

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `['${TKey}']` | `.${TKey}`
  >;
}[keyof TObj & (string | number)];

type RecursiveKeyOfHandleValue<
  TValue,
  Text extends string,
> = TValue extends unknown[]
  ? Text
  : TValue extends object
    ? Text | `${Text}${RecursiveKeyOfInner<TValue>}`
    : Text;

export type TranslateKey = RecursiveKeyOf<EnLangType>;
export const translate = (
  key: TranslateKey | string,
  options?: Record<string, unknown>
): string => {
  return i18n.t(key, options);
};
