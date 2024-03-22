import { createContext } from 'react';

import { NormalizedInterval } from 'date-fns/types';

export const CalendarRangeContext = createContext<NormalizedInterval>({
  start: new Date(Date.now()),
  end: new Date(Date.now())
});

export const CalendarRangeDispatch = createContext<Function>(() => {});
