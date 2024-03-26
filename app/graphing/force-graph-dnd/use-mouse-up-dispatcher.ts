import React, { useContext } from 'react';
import { getButton } from './get-button';
import { ForceGraphMouseButtonEventsDispatch } from './mouse-event-context-creator';

export function useMouseUpDispatcher() {
  const dispatchMouseEvent = useContext(ForceGraphMouseButtonEventsDispatch);

  return (e: React.MouseEvent) => {
    const button = getButton(e);
    if (button === 'n/a') return;
    dispatchMouseEvent({
      type: button,
      payload: { state: false, trigger: e }
    });
  };
}