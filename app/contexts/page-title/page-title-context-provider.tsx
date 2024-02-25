'use client';

import { ReactNode, useState } from 'react';
import { PageTitleContext } from './page-title-context';

export default function PageTitleContextProvider({
  children
}: {
  children: ReactNode;
}) {
  const [title, setTitle] = useState('Dashboard');
  return (
    <PageTitleContext.Provider value={{ title: title, setTitle: setTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}
