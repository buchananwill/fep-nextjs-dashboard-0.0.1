'use client';
import {
  useSelectiveContextControllerBoolean,
  useSelectiveContextDispatchBoolean
} from '../../components/selective-context/selective-context-manager-boolean';
import { useGraphName } from './graph-context-creator';
import { useEffect } from 'react';

export const ShowForceAdjustmentsKey = 'show-force-adjustments';

export const ControllerKey = 'controller';

export function ShowForceAdjustments() {
  useSelectiveContextControllerBoolean(
    ShowForceAdjustmentsKey,
    ControllerKey,
    true
  );
  return <></>;
}

export function useForceAdjustments(show: boolean) {
  const graphName = useGraphName();
  const { currentState, dispatchWithoutControl } =
    useSelectiveContextDispatchBoolean(
      ShowForceAdjustmentsKey,
      graphName,
      show
    );
  useEffect(() => {
    dispatchWithoutControl(show);
  }, [show, dispatchWithoutControl]);
}
