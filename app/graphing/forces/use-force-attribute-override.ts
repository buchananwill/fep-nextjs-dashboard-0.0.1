import { useSelectiveContextDispatchNumber } from '../../generic/components/selective-context/selective-context-manager-number';
import { useGraphName } from '../graph/graph-context-creator';
import { useEffect, useRef, useState } from 'react';
import { useSelectiveContextListenerBoolean } from '../../generic/components/selective-context/selective-context-manager-boolean';

export function useForceAttributeOverride(attribute: string, value: number) {
  const graphName = useGraphName();
  const { isTrue: readyToGraph } = useSelectiveContextListenerBoolean(
    `${graphName}-ready`,
    `${graphName}:${attribute}:default`,
    false
  );

  const { currentState, dispatchWithoutControl } =
    useSelectiveContextDispatchNumber({
      contextKey: `${graphName}-${attribute}`,
      listenerKey: `${graphName}:${attribute}:default`,
      initialValue: value
    });

  const [defaultHasBeenSet, setDefaultHasBeenSet] = useState(false);
  useEffect(() => {
    if (readyToGraph) {
      dispatchWithoutControl(value);
    }
  }, [readyToGraph, dispatchWithoutControl, value]);
}
