'use client';
import { DateColumnContext } from './date-column-context';
import { ReactNode } from 'react';

export default function DateColumnContextProvider({
  children,
  date
}: {
  children: ReactNode;
  date: Date;
}) {
  return (
    <DateColumnContext.Provider value={date}>
      {children}
    </DateColumnContext.Provider>
  );
}
