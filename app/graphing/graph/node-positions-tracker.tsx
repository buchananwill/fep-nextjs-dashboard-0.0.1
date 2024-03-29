'use client';
import { useSelectiveContextControllerNumber } from '../../selective-context/components/typed/selective-context-manager-number';
import { NodePositionsKey } from '../graph-types/organization/curriculum-delivery-graph';
import { useGraphName } from './graph-context-creator';

export default function NodePositionsTracker() {
  const s = useGraphName();
  const {} = useSelectiveContextControllerNumber({
    contextKey: NodePositionsKey,
    listenerKey: `${s}:position-counter`,
    initialValue: 0
  });
  return <></>;
}
