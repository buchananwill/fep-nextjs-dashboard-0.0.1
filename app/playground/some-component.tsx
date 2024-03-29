'use client';
import { useSelectiveContextAnyController } from '../selective-context/components/global/selective-context-manager-global';
import { NameIdStringTuple } from '../api/dtos/NameIdStringTupleSchema';

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
    <div className={'indicator'}>
      <span className={'indicator-item badge badge-info'}>
        {currentState.id}
      </span>
      <div>{currentState.name}</div>
    </div>
  );
}
