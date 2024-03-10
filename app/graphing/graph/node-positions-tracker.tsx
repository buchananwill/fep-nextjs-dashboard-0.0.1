'use client';
import { useSelectiveContextControllerNumber } from '../../components/selective-context/selective-context-manager-number';
import { NodePositionsKey } from '../graph-types/curriculum-delivery-graph';

export default function NodePositionsTracker() {
  let nodeVersion: number;
  ({ currentState: nodeVersion } = useSelectiveContextControllerNumber({
    contextKey: NodePositionsKey,
    listenerKey: 'curriculum-delivery-graph',
    initialValue: 0
  }));
  return <></>;
}