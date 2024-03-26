import { CalendarIdContext } from './calendar-id-context';
import { ReactNode } from 'react';

export default function CalendarIdContextProvider({
  children,
  calendarId
}: {
  children: ReactNode;
  calendarId: number;
}) {
  return (
    <CalendarIdContext.Provider value={calendarId}>
      {children}
    </CalendarIdContext.Provider>
  );
}
