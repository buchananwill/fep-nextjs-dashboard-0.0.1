'use client';
import { HasNumberIdDto } from '../api/dtos/HasNumberIdDtoSchema';
import { HasNameDto } from '../api/dtos/HasNameDtoSchema';
import { isNotUndefined, ObjectPlaceholder } from '../api/main';
import { PendingOverlay } from '../generic/components/overlays/pending-overlay';
import { Button } from '@nextui-org/button';
import { Badge } from '@tremor/react';
import { DtoComponentWrapperRenderProps } from './dto-component-wrapper';
import RenameModal from '../generic/components/modals/rename-modal';
import { useModal } from '../generic/components/modals/confirm-action-modal';
import { useSelectiveContextControllerString } from '../selective-context/components/typed/selective-context-manager-string';
import { RenameModalWrapperContextKey } from '../selective-context/keys/modal-keys';
import { useCallback } from 'react';

export function ExampleRenderPropFunctionComponent<
  T extends HasNumberIdDto & HasNameDto
>({ entity, dispatchWithoutControl }: DtoComponentWrapperRenderProps<T>) {
  const { closeModal, isOpen, openModal } = useModal();

  const contextKey = `${RenameModalWrapperContextKey}:example:${entity.id}`;
  const { currentState } = useSelectiveContextControllerString(
    contextKey,
    'example',
    entity.name
  );

  const onConfirm = useCallback(() => {
    if (isNotUndefined(dispatchWithoutControl)) {
      dispatchWithoutControl((dto) => ({ ...dto, name: currentState }));
    }
    closeModal();
  }, [currentState]);

  return (
    <>
      {<PendingOverlay pending={entity === ObjectPlaceholder} />}
      <Button onPress={openModal}>Current name: {entity.name}</Button>
      <Badge>Current id: {entity.id}</Badge>
      <RenameModal
        contextKey={contextKey}
        show={isOpen}
        onClose={closeModal}
        onConfirm={onConfirm}
        onCancel={closeModal}
      />
    </>
  );
}
