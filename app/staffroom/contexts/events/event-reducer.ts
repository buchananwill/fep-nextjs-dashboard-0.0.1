import { EventsContextObject } from './event-context';
import { NormalizedInterval } from 'date-fns/types';
import { produce } from 'immer';
import { EventDto } from '../../../api/dtos/EventDtoSchema';

export interface SetEventInterval {
  type: 'setEventInterval';
  interval: NormalizedInterval;
  eventId: string;
  providerId: number;
}

export interface SetEvent {
  type: 'setEvent';
  event: EventDto;
}

export interface AddUnSyncedEvent {
  type: 'addUnSyncedEvent';
  event: EventDto;
}

export interface ClearUnSyncedEvents {
  type: 'clearUnSyncedEvents';
}

export type EventAction =
  | SetEventInterval
  | SetEvent
  | ClearUnSyncedEvents
  | AddUnSyncedEvent;

export function EventReducer(state: EventsContextObject, action: EventAction) {
  switch (action.type) {
    case 'setEventInterval': {
      const { interval, eventId, providerId } = action;
      return produce(state, (draft) => {
        const eventList = draft.events.get(providerId);
        if (eventList) {
          const foundEvent = eventList.find((event) => event.id == eventId);
          if (foundEvent) {
            foundEvent.eventStart = interval.start;
            foundEvent.eventEnd = interval.end;
          }
        }
      });
    }
    case 'setEvent': {
      const { event } = action;
      const { id, ownerRoleId } = event;
      return produce(state, (draft) => {
        draft.eventsById[id] = event;
        const eventList = draft.events.get(ownerRoleId);
        if (eventList) {
          const updatedList = [];
          let seen = false;
          for (let eventListElement of eventList) {
            if (eventListElement.id == id) {
              updatedList.push(event);
              seen = true;
            } else {
              updatedList.push(eventListElement);
            }
          }
          if (!seen) {
            updatedList.push(event);
          }
          draft.events.set(ownerRoleId, updatedList);
        } else {
          draft.events.set(ownerRoleId, [event]);
        }

        const eventsByIdElement = state.eventsById[id];

        if (eventsByIdElement?.ownerRoleId != ownerRoleId) {
          const otherList = state.events.get(eventsByIdElement.ownerRoleId);
          if (otherList) {
            draft.events.set(
              eventsByIdElement.ownerRoleId,
              otherList.filter((nextEvent) => nextEvent.id != id)
            );
          }
        }
      });
    }
    case 'clearUnSyncedEvents': {
      return produce(state, (draft) => {
        draft.unSyncedEvents = [];
      });
    }
    case 'addUnSyncedEvent': {
      const { event } = action;

      return produce(state, (draft) => {
        if (!state.unSyncedEvents.some((value) => event.id == value)) {
          draft.unSyncedEvents.push(event.id);
        }
      });
    }

    default: {
      throw Error('Event action type not supported');
    }
  }
}
