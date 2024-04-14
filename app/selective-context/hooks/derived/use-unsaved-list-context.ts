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

  const { dispatchWithoutControl: addIdToUnsavedList } =
    useSelectiveContextDispatchStringList({
      contextKey: unsavedChangesContextKey,
      listenerKey: unsavedChangesListenerKey,
      initialValue: EmptyArray
    });
  return useCallback(
    (idForMap: string) => {
      addIdToUnsavedList((prev) => [...prev, idForMap]);
      dispatchWithoutControl(true);
    },
    [dispatchWithoutControl, addIdToUnsavedList]
  );
}
