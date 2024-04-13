'use client';
import { HasNameDto } from '../api/dtos/HasNameDtoSchema';
import { HasId, isNotUndefined } from '../api/main';
import { Button } from '@nextui-org/button';
import { DtoComponentUiProps } from './dto-component-wrapper';
import RenameModal from '../generic/components/modals/rename-modal';
import { useModal } from '../generic/components/modals/confirm-action-modal';
import { useSelectiveContextControllerString } from '../selective-context/components/typed/selective-context-manager-string';
import { RenameContextKey } from '../selective-context/keys/modal-keys';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { PencilSquareIcon } from '@heroicons/react/20/solid';

export function useRenameEntity<T extends HasNameDto & HasId>(
  entityClass: string,
  entity: T,
  listenerKey: string,
  dispatchWithoutControl?: Dispatch<SetStateAction<T>>
) {
  const { onClose, show, openModal } = useModal();
  const contextKey = `${RenameContextKey}:${entityClass}:${entity.id}`;
  const { currentState } = useSelectiveContextControllerString(
    contextKey,
    listenerKey,
    entity.name
  );

  const onConfirm = useCallback(() => {
    if (isNotUndefined(dispatchWithoutControl)) {
      dispatchWithoutControl((dto) => ({ ...dto, name: currentState }));
    }
    onClose();
  }, [currentState, dispatchWithoutControl, onClose]);
  return { onClose, show, openModal, contextKey, onConfirm, onCancel: onClose };
}

export function RenameEntity<T extends HasId & HasNameDto>({
  entity,
  entityClass,
  dispatchWithoutControl
}: DtoComponentUiProps<T>) {
  const listenerKey = 'example';
  const { openModal, ...renameModalProps } = useRenameEntity(
    entityClass,
    entity,
    listenerKey,
    dispatchWithoutControl
  );

  return (
    <>
      <Button onPress={openModal}>
        {entity.name}
        <PencilSquareIcon className={'w-4 h-4'} />
      </Button>
      <RenameModal {...renameModalProps} />
    </>
  );
}
