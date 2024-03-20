'use client';
import {
  useSelectiveContextControllerBoolean,
  useSelectiveContextDispatchBoolean
} from '../components/selective-context/selective-context-manager-boolean';
import { ShowNodeEditingKey } from './nodes/node-editor-disclosure';
import {
  ControllerKey,
  ShowForceAdjustmentsKey
} from './graph/show-force-adjustments';
import { useGraphName } from './graph/graph-context-creator';
import { useEffect } from 'react';

export function ShowNodeEditing() {
  useSelectiveContextControllerBoolean(
    ShowNodeEditingKey,
    ControllerKey,
    false
  );

  return <></>;
}

export function useShowNodeEditing(show: boolean) {
  const graphName = useGraphName();
  const { currentState, dispatchWithoutControl } =
    useSelectiveContextDispatchBoolean(ShowNodeEditingKey, graphName, show);
  useEffect(() => {
    dispatchWithoutControl(show);
  }, [show, dispatchWithoutControl]);
}
