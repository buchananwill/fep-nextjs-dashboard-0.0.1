'use client';
import { useSelectiveContextControllerBoolean } from '../../selective-context/components/typed/selective-context-manager-boolean';
import { useContext, useEffect, useMemo } from 'react';
import { GraphContext } from './graph-context-creator';

export default function MountedTracker({}: {}) {
  const { uniqueGraphName } = useContext(GraphContext);
  const mountedKey = useMemo(
    () => `${uniqueGraphName}-mounted`,
    [uniqueGraphName]
  );

  const { dispatchUpdate } = useSelectiveContextControllerBoolean(
    mountedKey,
    mountedKey,
    true
  );

  useEffect(() => {
    dispatchUpdate({ contextKey: mountedKey, update: true });
    return () => {
      dispatchUpdate({ contextKey: mountedKey, update: false });
    };
  }, [dispatchUpdate, mountedKey]);
  return <div></div>;
}
