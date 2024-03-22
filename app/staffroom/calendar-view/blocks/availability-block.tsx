import { ProviderAvailability } from '../../../api/dto-interfaces';
import { useContext, useEffect } from 'react';
import {
  AvailabilityContext,
  AvailabilityDispatchContext
} from '../../contexts/availability/availability-context';
import { BarsArrowDownIcon } from '@heroicons/react/20/solid';
import { produce } from 'immer';
import { addHours } from 'date-fns';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function AvailabilityBlock({
  providerAvailability
}: {
  providerAvailability: ProviderAvailability;
}) {
  const dndId = `${providerAvailability.providerId}-${providerAvailability.cycleSubspan.id}`;
  const {
    attributes,
    listeners,
    setNodeRef: setNodeRefDrag,
    transform,
    active
  } = useDraggable({
    id: dndId,
    data: providerAvailability
  });

  const { isOver, setNodeRef: setNodeRefDrop } = useDroppable({
    id: dndId
  });

  const { dispatch } = useContext(AvailabilityDispatchContext);

  useEffect(() => {
    dispatch({
      type: 'setDndKey',
      draggableKey: dndId,
      data: providerAvailability
    });
  });

  const { availabilityCode } = providerAvailability;

  let available = availabilityCode == 1;

  const hue = availabilityCode == 1 ? 'emerald' : 'red';

  function handleToggle() {
    dispatch({
      type: 'toggleAvailability',
      mechanic: providerAvailability.providerId,
      targetOutcome: 1 - availabilityCode,
      start: providerAvailability.cycleSubspan.timespan.start,
      end: providerAvailability.cycleSubspan.timespan.end
    });
  }

  const style = {
    transform: CSS.Translate.toString(transform)
  };

  return (
    <div
      ref={setNodeRefDrop}
      className={`leading-none  h-full w-full ${
        isOver ? 'outline-2 outline' : ''
      }`}
    >
      <div
        className={`rounded-md overflow-hidden text-sm leading-none flex row text-center items-center align-middle h-full w-full cursor-pointer select-none`}
        ref={setNodeRefDrag}
        style={style}
      >
        <button
          className={`w-1/2 h-full text-${hue}-300 
          bg-${hue}-300
          ${active == null ? 'hover:text-black hover:opacity-100' : ''} 
           ${active?.id == dndId || available ? 'opacity-100' : 'opacity-25'}`}
          onClick={() => handleToggle()}
        >
          {availabilityCode == 1 ? '-' : '+'}
        </button>
        <button
          className={`w-1/2 h-full flex justify-center bg-${hue}-300 text-${hue}-300
          
           ${
             active == null
               ? 'hover:text-black hover:opacity-100 opacity-25'
               : ''
           } 
           ${active?.id == dndId ? 'opacity-100' : 'opacity-25'}`}
          // onClick={() => handleCascade()}
          {...listeners}
          {...attributes}
        >
          <BarsArrowDownIcon className="mt-0.5 h-3 w-3 "></BarsArrowDownIcon>
        </button>
      </div>
    </div>
  );
}
