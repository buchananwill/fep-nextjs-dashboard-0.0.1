'use client';
import {
  EventsContext,
  EventsContextObject,
  EventsDispatch
} from './event-context';
import { ReactNode, useReducer } from 'react';
import { EventReducer } from './event-reducer';

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
