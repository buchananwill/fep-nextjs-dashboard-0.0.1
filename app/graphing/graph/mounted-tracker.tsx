'use client';
import { useSelectiveContextControllerBoolean } from '../../generic/components/selective-context/selective-context-manager-boolean';
import { useContext, useEffect, useMemo } from 'react';
import { GraphContext } from './graph-context-creator';

export default function MountedTracker({}: {}) {
  const { uniqueGraphName } = useContext(GraphContext);
  const mountedKey = useMemo(
    () => `${uniqueGraphName}-mounted`,
    [uniqueGraphName]
  );

  const { currentState, dispatchUpdate } = useSelectiveContextControllerBoolean(
    mountedKey,
    mountedKey,
    true
  );

  useEffect(() => {
    dispatchUpdate({ contextKey: mountedKey, value: true });
    return () => {
      dispatchUpdate({ contextKey: mountedKey, value: false });
    };
  }, [dispatchUpdate, mountedKey]);
  return <div></div>;
}
