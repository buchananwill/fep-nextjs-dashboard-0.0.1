import { CalendarIdContext } from './calendar-id-context';

export default function CalendarIdContextProvider({
  children,
  calendarId
}: {
  children: React.ReactNode;
  calendarId: number;
}) {
  return (
    <CalendarIdContext.Provider value={calendarId}>
      {children}
    </CalendarIdContext.Provider>
  );
}
