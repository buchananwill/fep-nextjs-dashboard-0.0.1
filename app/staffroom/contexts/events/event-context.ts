import { createContext, Dispatch } from 'react';

import { CalendarEvent } from '../../../api/zod-mods';
import { EventAction } from './event-reducer';
import { NormalizedInterval } from 'date-fns/types';

export interface CalendarDropZone {
  start: number;
  end: number;
  providerId: number;
}

export interface EventsContextObject {
  events: Map<number, CalendarEvent[]>;
  eventsById: { [key: string]: CalendarEvent };
  unSyncedEvents: string[];
}
export const EventsContext = createContext<EventsContextObject>({
  events: new Map(),
  eventsById: {},
  unSyncedEvents: []
});

export const EventsDispatch = createContext<Dispatch<EventAction>>(() => {});
