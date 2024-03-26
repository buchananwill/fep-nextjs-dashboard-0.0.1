import { useCurriculumModelContext } from './contexts/use-curriculum-model-context';
import { useSelectiveContextDispatchBoolean } from '../../generic/components/selective-context/selective-context-manager-boolean';
import {
  EmptyIdArray,
  UnsavedCurriculumModelChanges
} from './contexts/curriculum-models-context-provider';
import {
  ConfirmActionModalProps,
  useModal
} from '../../components/confirm-action-modal';
import { useSelectiveContextKeyMemo } from '../../generic/hooks/selective-context/use-selective-context-listener';
import {
  RenameModalProps,
  RenameModalWrapperContextKey
} from '../../components/rename-modal/rename-modal';
import { useSelectiveContextControllerString } from '../../generic/components/selective-context/selective-context-manager-string';
import { useSelectiveContextListenerStringList } from '../../generic/components/selective-context/selective-context-manager-string-list';
import { ValidatorContextKey } from './[yearGroup]/curriculum-model-name-list-validator';
import { useValidationUniqueNonEmpty } from '../../teaching-categories/[categoryIdentifier]/knowledge-level/knowledge-level-name-cell';
import { produce } from 'immer';

export function useRenameCurriculumDeliveryModel(
  modelId: string,
  listenerKey: string
) {
  const { dispatch, curriculumModelsMap } = useCurriculumModelContext();

  const { dispatchWithoutControl } = useSelectiveContextDispatchBoolean(
    UnsavedCurriculumModelChanges,
    listenerKey,
    false
  );

  const { isOpen, closeModal, openModal } = useModal();
  const renameModalContextKey = useSelectiveContextKeyMemo(
    `${RenameModalWrapperContextKey}:${modelId}`,
    listenerKey
  );
  const { currentState: proposedName, dispatchUpdate } =
    useSelectiveContextControllerString(
      renameModalContextKey,
      listenerKey,
      curriculumModelsMap[modelId].name
    );

  const { currentState: nameList } = useSelectiveContextListenerStringList(
    ValidatorContextKey,
    listenerKey,
    EmptyIdArray
  );

  const error = useValidationUniqueNonEmpty(
    proposedName,
    curriculumModelsMap[modelId].name,
    nameList
  );

  const handleConfirmRename = () => {
    const curriculumModelsMapElement = curriculumModelsMap[modelId];
    if (curriculumModelsMapElement) {
      const workProjectSeriesSchemaDtoUpdate = produce(
        curriculumModelsMapElement,
        (draft) => {
          draft.name = proposedName;
        }
      );
      dispatch({
        type: 'update',
        payload: { key: modelId, data: workProjectSeriesSchemaDtoUpdate }
      });
    }

    dispatchWithoutControl(true);
    closeModal();
  };

  const handleCancelRename = () => {
    dispatchUpdate({
      contextKey: renameModalContextKey,
      value: curriculumModelsMap[modelId]?.name
    });
    closeModal();
  };

  const renameModalProps: RenameModalProps & ConfirmActionModalProps = {
    contextKey: renameModalContextKey,
    onConfirm: handleConfirmRename,
    onCancel: handleCancelRename,
    onClose: closeModal,
    show: isOpen,
    error: error
  };

  return {
    openModal,
    renameModalProps
  };
}
