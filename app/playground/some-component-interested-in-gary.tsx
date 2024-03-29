'use client';
import { useSelectiveContextGlobalListener } from '../selective-context/components/global/selective-context-manager-global';
import { ObjectPlaceholder } from '../selective-context/components/typed/selective-context-manager-function';
import { NameIdStringTuple } from '../api/dtos/NameIdStringTupleSchema';
import { Badge, Card } from '@tremor/react';

export default function SomeComponentInterestedInGary() {
  const { currentState } = useSelectiveContextGlobalListener<NameIdStringTuple>(
    {
      contextKey: 'a-context',
      listenerKey: 'just-a-listener',
      initialValue: ObjectPlaceholder as NameIdStringTuple
    }
  );
  return (
    <Card>
      <Badge>Current name: {currentState.name}</Badge>
      <Badge>Current id: {currentState.id}</Badge>
    </Card>
  );
}
