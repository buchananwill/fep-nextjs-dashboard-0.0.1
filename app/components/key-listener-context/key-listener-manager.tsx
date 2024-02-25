'use client';
import { PropsWithChildren, useContext, useEffect } from 'react';
import {
  LeftCtrlListener,
  LeftShiftListener,
  SpaceListener
} from './key-listener-context-creator';
import {
  useKeyHeldListener,
  useLeftCtrlHeldListener,
  useShiftHeldListener,
  useSpaceHeldListener
} from '../useKeyHeldListener';
import { useSelectiveContextDispatchBoolean } from '../selective-context/selective-context-manager-boolean';

export default function KeyListenerManager({ children }: PropsWithChildren) {
  const spaceHeld = useSpaceHeldListener(); //useKeyHeldListener(' ', 'Space');

  const shiftHeld = useShiftHeldListener();

  const leftCtrlHeld = useLeftCtrlHeldListener();

  return (
    <SpaceListener.Provider value={spaceHeld}>
      <LeftShiftListener.Provider value={shiftHeld}>
        <LeftCtrlListener.Provider value={leftCtrlHeld}>
          {children}
        </LeftCtrlListener.Provider>
      </LeftShiftListener.Provider>
    </SpaceListener.Provider>
  );
}
