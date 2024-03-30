'use client';
import { useSelectiveContextAnyController } from '../selective-context/components/global/selective-context-manager-global';
import { NameIdStringTuple } from '../api/dtos/NameIdStringTupleSchema';
import { Badge } from '@nextui-org/badge';

const tuple: NameIdStringTuple = {
  id: '1',
  name: 'Gary'
};

export default function SomeComponent() {
  const { currentState, dispatchUpdate } =
    useSelectiveContextAnyController<NameIdStringTuple>({
      contextKey: 'a-context',
      listenerKey: 'controller',
      initialValue: tuple
    });
  return (
    <Badge content={`${currentState.id}`}>
      <div>{currentState.name}</div>
    </Badge>
  );
}
