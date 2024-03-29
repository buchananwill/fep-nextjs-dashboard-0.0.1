'use client';
import { useSelectiveContextAnyDispatch } from '../selective-context/components/global/selective-context-manager-global';
import { NameIdStringTuple } from '../api/dtos/NameIdStringTupleSchema';
import { ObjectPlaceholder } from '../selective-context/components/typed/selective-context-manager-function';
import { parseTen } from '../api/date-and-time';

export default function SomeButtonToControlGary() {
  const { dispatchWithoutControl, currentState } =
    useSelectiveContextAnyDispatch<NameIdStringTuple>({
      contextKey: 'a-context',
      listenerKey: 'button',
      initialValue: ObjectPlaceholder as NameIdStringTuple
    });

  return (
    <button
      className={'btn '}
      onClick={() =>
        dispatchWithoutControl({
          ...currentState,
          id: `${parseTen(currentState.id) + 1}`
        })
      }
    >
      Increment Id
    </button>
  );
}
