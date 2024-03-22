'use client';

import { Card, Text } from '@tremor/react';
import { ChooseCalendarRange } from './calendar-view/range/choose-calendar-range';
import { StaffroomCalenderView } from './staffroom-calender-view';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { EventsContext, EventsDispatch } from './contexts/events/event-context';
import { Calendarable } from './calendar-view/blocks/timespan-block';
import { WorkshopJobBlock } from './calendar-view/blocks/workshop-job-block';
import { ProviderContext } from './contexts/providerRoles/provider-context';
import { PageTitleContext } from '../contexts/page-title/page-title-context';
import { DndContextProvider } from '../components/dnd-context-provider';
import { closestCenter, DragEndEvent } from '@dnd-kit/core';

import { ProviderRoleSelectionContext } from './contexts/providerRoles/provider-role-selection-context';
import { addMinutes, differenceInCalendarDays, format } from 'date-fns';
import { addDays } from 'date-fns/fp';
import { Transform } from '@dnd-kit/utilities';

import { produce } from 'immer';

import { ClearUnSyncedEvents } from './contexts/events/event-reducer';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { ProviderRoleDto } from '../api/dtos/ProviderRoleDtoSchema';
import { EventDto } from '../api/dtos/EventDtoSchema';
import { patchEvents } from '../api/actions/calendars';
import {
  isNotNull,
  isNotUndefined
} from '../graphing/editing/functions/graph-edits';
import {
  ConfirmActionModal,
  ConfirmActionModalProps
} from '../components/confirm-action-modal';
import { useCalendarScaledZoom } from './calendar-view/columns/time-column';

function getProvider(
  mechanicId: number,
  list: ProviderRoleDto[]
): ProviderRoleDto | undefined {
  return list.find((mechanicDto) => mechanicDto.id == mechanicId);
}

const smallestScheduleDelta = 15;
export default function Page() {
  const { events, eventsById, unSyncedEvents } = useContext(EventsContext);
  const dispatch = useContext(EventsDispatch);
  const { setTitle } = useContext(PageTitleContext);
  useEffect(() => {
    setTitle('Workshop Schedule');
  }, [setTitle]);

  const { providers } = useContext(ProviderContext);
  const { selectedProviders } = useContext(ProviderRoleSelectionContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<EventDto | null>(null);
  const [awaitingSync, setAwaitingSync] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const appRouterInstance = useRouter();
  const isPaused = useRef(false);

  const setEvent = useCallback(
    (calendarEvent: EventDto) =>
      dispatch({
        type: 'setEvent',
        event: calendarEvent
      }),
    [dispatch]
  );

  const addUnSynced = useCallback(
    (calendarEvent: EventDto) => {
      dispatch({
        type: 'addUnSyncedEvent',
        event: calendarEvent
      });
    },
    [dispatch]
  );

  const clearUnSyncedEvents = useCallback(() => {
    const dispatchClear: ClearUnSyncedEvents = { type: 'clearUnSyncedEvents' };
    dispatch(dispatchClear);
  }, [dispatch]);

  const eventBlocks = new Map<number, Calendarable[]>();

  selectedProviders.forEach(({ id, name }) => {
    const mechanic = getProvider(id, providers);
    if (!mechanic) return;
    const eventsThisMechanic = events.get(id);
    const elements: Calendarable[] =
      eventsThisMechanic?.map((calendarEvent, index) => {
        const { eventStart, eventEnd } = calendarEvent;
        const calendarable = {
          startDate: eventStart.getTime(),
          endDate: eventEnd.getTime(),
          key: calendarEvent.id,
          colorKey: name,
          content: (
            <WorkshopJobBlock
              workshopJob={calendarEvent}
              mechanic={mechanic}
              key={index}
            ></WorkshopJobBlock>
          )
        };
        return calendarable;
      }) || [];
    eventBlocks.set(id, elements);
  });

  function processPending(calendarEvent: EventDto) {
    setEvent(calendarEvent);
    addUnSynced(calendarEvent);
  }

  useEffect(() => {
    const doBatchPatch = async () => {
      const calendarEvents = unSyncedEvents.map((id) => eventsById[id]);
      const patchedEvents = await patchEvents(calendarEvents);
      if (patchedEvents) {
        patchedEvents
          .map((arp) => arp.data)
          .filter(isNotUndefined)
          .forEach(setEvent);
        clearUnSyncedEvents();
      } else {
        alert(
          'Error: could not sync events. Please refresh the page (shortcut: F5).'
        );
        clearUnSyncedEvents();
      }
      setAwaitingSync(false);
    };
    console.log('Awaiting?', awaitingSync);
    if (!awaitingSync && unSyncedEvents.length > 0) {
      setTimeout(async () => {
        if (!isPaused.current) {
          setAwaitingSync(true);
          await doBatchPatch();
        }
      }, 3000);
    }
  }, [
    awaitingSync,
    clearUnSyncedEvents,
    setEvent,
    eventsById,
    unSyncedEvents,
    confirmModalOpen
  ]);

  const changeProviderModal: ConfirmActionModalProps = {
    show: modalOpen,
    onConfirm: () => {
      if (!!pendingEvent) processPending(pendingEvent);
      setPendingEvent(null);
      setModalOpen(false);
    },
    onCancel: () => {
      setPendingEvent(null);
      setModalOpen(false);
    },
    onClose: () => setModalOpen(false)
  };

  const confirmModal: ConfirmActionModalProps = {
    show: confirmModalOpen,
    onConfirm: () => {
      isPaused.current = false;
      setConfirmModalOpen(false);
    },
    onCancel: () => {
      location.reload();
      setConfirmModalOpen(false);
    },
    onClose: () => setConfirmModalOpen(false)
  };

  return (
    <>
      <Card
        className="overflow-visible p-2 ml-4"
        style={{ maxWidth: '75%', width: 'fit-content' }}
      >
        {selectedProviders.length == 0 && (
          <div
            className={
              'w-full top-0 left-0 h-full bg-gray-100 bg-opacity-75 z-40 absolute rounded-lg flex items-center justify-center'
            }
          >
            No mechanic selected.
          </div>
        )}
        <ChooseCalendarRange></ChooseCalendarRange>
        <DndContextProvider
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
        >
          <StaffroomCalenderView eventBlocks={eventBlocks} />
        </DndContextProvider>
      </Card>
      <ConfirmActionModal
        title={'Assign to different mechanic?'}
        {...changeProviderModal}
      >
        <Text>Assign this task event to a different mechanic?</Text>
      </ConfirmActionModal>
      {unSyncedEvents.length > 0 && (
        <div
          className={
            'z-40 flex items-center border-gray-200 shadow-lg border-2 bg-gray-100 fixed top-16 right-16 p-2 rounded-md hover:bg-gray-50 group cursor-pointer'
          }
          onClick={() => {
            isPaused.current = true;
            setConfirmModalOpen(true);
          }}
        >
          Unsaved Changes{' '}
          <ExclamationTriangleIcon
            className={
              'p-1 h-8 w-8 text-red-500 group-hover:opacity-100 opacity-50 '
            }
          ></ExclamationTriangleIcon>
        </div>
      )}
      <ConfirmActionModal title={'Confirm Unsaved Changes'} {...confirmModal}>
        Confirm changes to events or revert to database state?
        {unSyncedEvents.map((event) => (
          <div key={event}>{eventsById[event].name}</div>
        ))}
      </ConfirmActionModal>
    </>
  );

  // Convert the draggable delta Y to minutes,
  // accounting for the view scale
  // and a gentle curve favouring rounding towards the original value.

  async function handleDragEnd(dragEndEvent: DragEndEvent) {
    const { over, active } = dragEndEvent;
    if (over) {
      const zoneIdString = over.id.toString();
      const dataActive = active.id;
      const { y } = dragEndEvent.delta;

      const eventByIdElement = eventsById[dataActive];
      const hashIndex = zoneIdString.indexOf('#');
      const providerId = parseInt(zoneIdString.slice(0, hashIndex));

      const date = new Date(zoneIdString.slice(hashIndex + 1));
      const deltaMinutes = convertDeltaYtoMinutes(y, y);

      const daysDifference = differenceInCalendarDays(
        date,
        eventByIdElement.eventStart
      );
      const updatedDayStart = addDays(
        daysDifference,
        eventByIdElement.eventStart
      );

      const updatedDayEnd = addDays(daysDifference, eventByIdElement.eventEnd);

      const updatedStart = addMinutes(updatedDayStart, deltaMinutes);
      const updatedEnd = addMinutes(updatedDayEnd, deltaMinutes);
      const calendarEvent = produce(eventByIdElement, (draft) => {
        draft.eventStart = updatedStart;
        draft.eventEnd = updatedEnd;
        draft.ownerRoleId = providerId;
      });

      if (providerId != eventByIdElement.ownerRoleId) {
        setPendingEvent(calendarEvent);
        setModalOpen(true);
      } else {
        processPending(calendarEvent);
      }
    }
  }
}

function convertDeltaYtoMinutes(delta: number, hourHeight1: number) {
  const scaleFactor = hourHeight1 / 60;
  const scaledDelta = delta / scaleFactor;
  const quantisedDelta = scaledDelta / smallestScheduleDelta;
  const negative = quantisedDelta < 0;
  const decimalPart = quantisedDelta % 1;
  const positiveDecimal = decimalPart < 0 ? decimalPart * -1 : decimalPart;
  const squareCurve = Math.pow(positiveDecimal, 1.4);
  const roundAway = squareCurve > 0.5;
  const floor = (roundAway && negative) || (!roundAway && !negative);
  const roundedDelta = floor
    ? Math.floor(quantisedDelta)
    : Math.ceil(quantisedDelta);
  return roundedDelta * smallestScheduleDelta;
}

export function TimeDeltaMonitor({
  transform,
  referenceDate
}: {
  transform: Transform;
  referenceDate: Date;
}) {
  const { y } = useCalendarScaledZoom();
  const deltaMinutes = convertDeltaYtoMinutes(transform.y, y);

  const updatedDate = addMinutes(referenceDate, deltaMinutes);

  const updatedTimeFormatted = format(updatedDate, 'HH:mm');

  const positive = deltaMinutes >= 0;
  const deltaHours = deltaMinutes / 60;
  const residueMinutes = (deltaMinutes % 60) * (positive ? 1 : -1);

  const wholeHours = positive
    ? Math.floor(deltaHours)
    : Math.ceil(deltaHours) * -1;
  const formattedDelta = `${positive ? '+' : '-'}${
    wholeHours < 10 ? '0' : ''
  }${wholeHours}:${residueMinutes < 10 ? '0' : ''}${residueMinutes}`;

  return (
    <div
      className={
        'z-40 absolute top-8 w-full h-full min-w-full min-h-full cursor-pointer'
      }
    >
      <div
        className={
          'bg-gray-50 opacity-100 w-fit border border-dark-tremor-border rounded-lg p-2 text-sm whitespace-nowrap text-right flex flex-col'
        }
      >
        <span className={'font-mono text-sm'}>{updatedTimeFormatted}</span>
        <span className={'font-mono text-sm'}>{formattedDelta}</span>
      </div>
    </div>
  );
}
