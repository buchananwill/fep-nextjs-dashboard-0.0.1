import { useCurriculumModelContext } from './contexts/use-curriculum-model-context';
import { useSelectiveContextDispatchBoolean } from '../../selective-context/components/typed/selective-context-manager-boolean';
import {
  EmptyIdArray,
  UnsavedCurriculumModelChanges
} from './contexts/curriculum-models-context-provider';

import { useSelectiveContextKeyMemo } from '../../selective-context/hooks/generic/use-selective-context-listener';

import { useSelectiveContextControllerString } from '../../selective-context/components/typed/selective-context-manager-string';
import { useSelectiveContextListenerStringList } from '../../selective-context/components/typed/selective-context-manager-string-list';
import { ValidatorContextKey } from './[yearGroup]/curriculum-model-name-list-validator';
import { useValidationUniqueNonEmpty } from '../../teaching-categories/[categoryIdentifier]/knowledge-level/knowledge-level-name-cell';
import { produce } from 'immer';
import {
  ConfirmActionModalProps,
  useModal
} from '../../generic/components/modals/confirm-action-modal';
import { RenameModalProps } from '../../generic/components/modals/rename-modal';
import { RenameContextKey } from '../../selective-context/keys/modal-keys';

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

  const { show, onClose, openModal } = useModal();
  const renameModalContextKey = useSelectiveContextKeyMemo(
    `${RenameContextKey}:${modelId}`,
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
    onClose();
  };

  const handleCancelRename = () => {
    dispatchUpdate({
      contextKey: renameModalContextKey,
      update: curriculumModelsMap[modelId]?.name
    });
    onClose();
  };

  const renameModalProps: RenameModalProps & ConfirmActionModalProps = {
    contextKey: renameModalContextKey,
    onConfirm: handleConfirmRename,
    onCancel: handleCancelRename,
    onClose: onClose,
    show: show,
    error: error
  };

  return {
    openModal,
    renameModalProps
  };
}
