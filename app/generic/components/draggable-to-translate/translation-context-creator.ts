import { createContext } from 'react';

export interface Translation {
  x: number;
  y: number;
}

export interface TranslationContextInterface {
  [key: string]: Translation;
}

export interface TranslationPayload {
  draggableKey: string;
  translation: Translation;
}

export const TranslationContext = createContext<TranslationContextInterface>(
  {} as TranslationContextInterface
);

export const TranslationDispatchContext = createContext<
  (payload: TranslationPayload) => void
>(() => {});
