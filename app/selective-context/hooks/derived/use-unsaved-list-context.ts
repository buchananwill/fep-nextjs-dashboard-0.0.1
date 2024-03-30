import { useSelectiveContextDispatchBoolean } from '../../components/typed/selective-context-manager-boolean';
import { useSelectiveContextDispatchStringList } from '../../components/typed/selective-context-manager-string-list';
import { EmptyIdArray } from '../../../curriculum/delivery-models/contexts/curriculum-models-context-provider';
import { useCallback } from 'react';

export function useUnsavedListContext(
  unsavedChangesContextKey: string,
  unsavedChangesListenerKey: string
) {
  const { dispatchWithoutControl } = useSelectiveContextDispatchBoolean(
    unsavedChangesContextKey,
    unsavedChangesListenerKey,
    false
  );

  const { currentState, dispatchWithoutControl: addIdToUnsavedList } =
    useSelectiveContextDispatchStringList({
      contextKey: unsavedChangesContextKey,
      listenerKey: unsavedChangesListenerKey,
      initialValue: EmptyIdArray
    });
  return useCallback(
    (idForMap: string) => {
      addIdToUnsavedList([...currentState, idForMap]);
      dispatchWithoutControl(true);
    },
    [currentState]
  );
}
