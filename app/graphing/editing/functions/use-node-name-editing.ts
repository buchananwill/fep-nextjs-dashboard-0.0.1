import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { HasNameDto } from '../../../api/dtos/HasNameDtoSchema';
import { DataNode } from '../../../api/zod-mods';
import {
  ConfirmActionModalProps,
  useModal
} from '../../../components/confirm-action-modal';
import { useSelectiveContextKeyMemo } from '../../../components/selective-context/use-selective-context-listener';
import {
  RenameModalProps,
  RenameModalWrapperContextKey
} from '../../../components/rename-modal/rename-modal';
import { useSelectiveContextControllerString } from '../../../components/selective-context/selective-context-manager-string';
import { useContext } from 'react';
import { GraphContext } from '../../graph/graph-context-creator';
import { UnsavedNodeDataContextKey } from '../../graph-types/organization/curriculum-delivery-graph';
import { useSelectiveContextDispatchBoolean } from '../../../components/selective-context/selective-context-manager-boolean';
import { useDirectSimRefEditsDispatch } from './use-graph-edit-button-hooks';
import { OrganizationDto } from '../../../api/dtos/OrganizationDtoSchema';
import { resetLinks } from '../buttons/add-nodes-button';

export function useNodeNameEditing<T extends HasNumberIdDto & HasNameDto>(
  node: DataNode<T>,
  componentListenerKey: string
) {
  const { isOpen, closeModal, openModal } = useModal();
  const renameModalContextKey = useSelectiveContextKeyMemo(
    `${RenameModalWrapperContextKey}:${node.data.id}`,
    componentListenerKey
  );
  const { currentState, dispatchUpdate } = useSelectiveContextControllerString(
    renameModalContextKey,
    componentListenerKey,
    node.data.name
  );

  const { uniqueGraphName } = useContext(GraphContext);
  useSelectiveContextKeyMemo(UnsavedNodeDataContextKey, uniqueGraphName);

  const { nodeListRef, incrementSimVersion, linkListRef } =
    useDirectSimRefEditsDispatch<OrganizationDto>(componentListenerKey);
  const handleConfirmRename = () => {
    if (nodeListRef && linkListRef) {
      // const copiedElements = [...nodeListRef.current];
      const currentElement = nodeListRef.current[node.index!];

      currentElement.data.name = currentState;

      incrementSimVersion();
    }

    closeModal();
  };

  const handleCancelRename = () => {
    dispatchUpdate({
      contextKey: renameModalContextKey,
      value: node.data.name
    });
    closeModal();
  };

  const renameModalProps: RenameModalProps & ConfirmActionModalProps = {
    contextKey: renameModalContextKey,
    onConfirm: handleConfirmRename,
    onCancel: handleCancelRename,
    onClose: closeModal,
    show: isOpen
  };

  return {
    openModal,
    renameModalProps
  };
}
