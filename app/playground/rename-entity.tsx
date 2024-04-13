'use client';
import { HasNumberIdDto } from '../api/dtos/HasNumberIdDtoSchema';
import { HasNameDto } from '../api/dtos/HasNameDtoSchema';
import { isNotUndefined, ObjectPlaceholder } from '../api/main';
import { PendingOverlay } from '../generic/components/overlays/pending-overlay';
import { Button } from '@nextui-org/button';
import { Badge } from '@tremor/react';
import { DtoComponentUiProps } from './dto-component-wrapper';
import RenameModal from '../generic/components/modals/rename-modal';
import { useModal } from '../generic/components/modals/confirm-action-modal';
import { useSelectiveContextControllerString } from '../selective-context/components/typed/selective-context-manager-string';
import { RenameModalWrapperContextKey } from '../selective-context/keys/modal-keys';
import { useCallback } from 'react';
import { PencilSquareIcon } from '@heroicons/react/20/solid';

export function RenameEntity<T extends HasNumberIdDto & HasNameDto>({
  entity,
  dispatchWithoutControl
}: DtoComponentUiProps<T>) {
  const { onClose, show, openModal } = useModal();

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
    onClose();
  }, [currentState]);

  return (
    <div className={'flex justify-between px-2'}>
      {<PendingOverlay pending={entity === ObjectPlaceholder} />}
      <Button onPress={openModal}>
        <span className={'text-xs opacity-50'}>name:</span> {entity.name}
        <PencilSquareIcon className={'w-4 h-4'} />
      </Button>
      <Badge>
        <span className={'text-xs opacity-50'}>id:</span> {entity.id}
      </Badge>
      <RenameModal
        contextKey={contextKey}
        show={show}
        onClose={onClose}
        onConfirm={onConfirm}
        onCancel={onClose}
      />
    </div>
  );
}
