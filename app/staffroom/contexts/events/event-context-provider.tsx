'use client';
import {
  EventsContextObject,
  EventsContext,
  EventsDispatch
} from './event-context';
import { ReactNode, useEffect, useReducer } from 'react';
import { EventReducer } from './event-reducer';
import { CalendarEvent } from '../../../api/zod-mods';
import { patchEvent } from '../../../actions/calendars';
import { ActionResponsePromise } from '../../../actions/actionResponse';

export default function EventContextProvider({
  initialContext,
  children
}: {
  initialContext: EventsContextObject;
  children: ReactNode;
}) {
  const [eventsContext, reducer] = useReducer(EventReducer, initialContext);

  return (
    <EventsDispatch.Provider value={reducer}>
      <EventsContext.Provider value={eventsContext}>
        {children}
      </EventsContext.Provider>
    </EventsDispatch.Provider>
  );
}
