import { createContext, Dispatch } from 'react';

import { EventAction } from './event-reducer';
import { EventDto } from '../../../api/dtos/EventDtoSchema';

export interface CalendarDropZone {
  start: number;
  end: number;
  providerId: number;
}

export interface EventsContextObject {
  events: Map<number, EventDto[]>;
  eventsById: { [key: string]: EventDto };
  unSyncedEvents: string[];
}
export const EventsContext = createContext<EventsContextObject>({
  events: new Map(),
  eventsById: {},
  unSyncedEvents: []
});

export const EventsDispatch = createContext<Dispatch<EventAction>>(() => {});
