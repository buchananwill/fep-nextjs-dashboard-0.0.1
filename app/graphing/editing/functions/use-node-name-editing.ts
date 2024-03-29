import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { HasNameDto } from '../../../api/dtos/HasNameDtoSchema';
import { DataNode } from '../../../api/zod-mods';

import { useSelectiveContextKeyMemo } from '../../../selective-context/hooks/generic/use-selective-context-listener';

import { useSelectiveContextControllerString } from '../../../selective-context/components/typed/selective-context-manager-string';
import { useContext } from 'react';
import { GraphContext } from '../../graph/graph-context-creator';
import { UnsavedNodeDataContextKey } from '../../graph-types/organization/curriculum-delivery-graph';
import { useDirectSimRefEditsDispatch } from './use-graph-edit-button-hooks';
import { OrganizationDto } from '../../../api/dtos/OrganizationDtoSchema';
import {
  ConfirmActionModalProps,
  useModal
} from '../../../generic/components/modals/confirm-action-modal';
import { RenameModalProps } from '../../../generic/components/modals/rename-modal';
import { RenameModalWrapperContextKey } from '../../../selective-context/keys/modal-keys';

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
