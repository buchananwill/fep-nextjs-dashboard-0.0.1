import { useSelectiveContextDispatchStringList } from '../../components/selective-context/selective-context-manager-string-list';
import {
  DeletedCurriculumModelIdsKey,
  EmptyIdArray,
  UnsavedCurriculumModelChanges
} from './contexts/curriculum-models-context-provider';
import { useSelectiveContextDispatchBoolean } from '../../components/selective-context/selective-context-manager-boolean';
import { useMemo } from 'react';

export function useDeleteCurriculumDeliveryModel(
  modelId: string,
  listenerKey: string
) {
  const { currentState, dispatchWithoutControl } =
    useSelectiveContextDispatchStringList({
      contextKey: DeletedCurriculumModelIdsKey,
      listenerKey,
      initialValue: EmptyIdArray
    });
  const {
    currentState: unsavedChanges,
    dispatchWithoutControl: setUnsavedChanges
  } = useSelectiveContextDispatchBoolean(
    UnsavedCurriculumModelChanges,
    listenerKey,
    false
  );
  const handleDelete = useMemo(() => {
    return function () {
      dispatchWithoutControl([...currentState, modelId]);
      setUnsavedChanges(true);
    };
  }, [setUnsavedChanges, currentState, dispatchWithoutControl, modelId]);
  const handleUnDelete = useMemo(() => {
    return function () {
      dispatchWithoutControl(currentState.filter((id) => id !== modelId));
      setUnsavedChanges(true);
    };
  }, [setUnsavedChanges, currentState, dispatchWithoutControl, modelId]);

  return { handleDelete, currentState, handleUnDelete };
}
