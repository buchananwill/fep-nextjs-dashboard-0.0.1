import { createContext } from 'react';

export interface PageTitleContext {
  title: string;
  setTitle: (title: string) => void;
}

const defaultContext: PageTitleContext = {
  title: 'Dashboard',
  setTitle: () => {}
};

export const PageTitleContext = createContext(defaultContext);
