import WorkshopJobModal from '../../workshop-job-modal/workshop-job-modal';
import { Text } from '@tremor/react';
import React, { useContext, useEffect } from 'react';
import { ColorCoding } from '../../../contexts/color-coding/context';
import { CalendarEvent, MechanicDto } from '../../../api/zod-mods';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { EventsDispatch } from '../../contexts/events/event-context';
import { TimeDeltaMonitor } from '../../page';
import { Z_ContextDispatch } from '../../../contexts/z-context/z-context';

export function WorkshopJobBlock({
  workshopJob,
  mechanic
}: {
  workshopJob: CalendarEvent;
  mechanic: MechanicDto;
}) {
  const { description, normalizedEventOutcome, id, eventStart } = workshopJob;
  const colorCodingState = useContext(ColorCoding);
  const { setZIndex } = useContext(Z_ContextDispatch);
  const done = normalizedEventOutcome == 1;
  const {
    transform,
    active,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    attributes
  } = useDraggable({ id: id, disabled: done });
  const dispatch = useContext(EventsDispatch);
  const isActiveDragNode = active?.id == id;

  useEffect(() => {
    dispatch({
      type: 'setEvent',
      event: workshopJob
    });
  }, [workshopJob, dispatch]);

  useEffect(() => {
    if (isActiveDragNode) {
      setZIndex('z-30');
    } else {
      setZIndex('z-10');
    }
  }, [setZIndex, isActiveDragNode]);

  const partyName = mechanic?.partyName;

  let hue = 'gray';
  if (done) {
    hue = 'gray';
  } else if (partyName) {
    hue = colorCodingState[partyName]?.hue.id;
  }

  const style = {
    transform: CSS.Translate.toString(transform)
  };

  return (
    <div
      className={`p-0.5 m-0 text-${hue}-600 bg-${hue}-100 border-${hue}-300 border-2 rounded-lg w-full h-full flex flex-col 
        ${done && !isActiveDragNode ? 'opacity-50' : ''}
        ${isActiveDragNode ? 'z-40' : 'hover:animate-pulse'}`}
      style={style}
    >
      {isActiveDragNode && transform && (
        <TimeDeltaMonitor transform={transform} referenceDate={eventStart} />
      )}
      <div className={'w-full h-full overflow-hidden'}>
        <div
          ref={setNodeRef}
          className={'h-fit min-h-fit w-full flex justify-start grow'}
        >
          <WorkshopJobModal workshopJob={workshopJob}></WorkshopJobModal>
          <div
            {...attributes}
            {...listeners}
            ref={setActivatorNodeRef}
            className={'grow'}
          ></div>
        </div>
        <div
          className={'overflow-hidden max-h-full h-full'}
          {...attributes}
          {...listeners}
          ref={setActivatorNodeRef}
        >
          Job #{workshopJob.eventReasonId}
          <Text className="text-xs ">{description}</Text>
          <Text className="text-xs ">Outcome: {normalizedEventOutcome}</Text>
        </div>
      </div>
    </div>
  );
}
