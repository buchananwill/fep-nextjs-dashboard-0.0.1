'use client';
import { KnowledgeDomainDto } from '../../../api/dtos/KnowledgeDomainDtoSchema';

import { useSelectiveContextControllerString } from '../../../selective-context/components/typed/selective-context-manager-string';

import { PencilSquareIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';
import { useValidationUniqueNonEmpty } from '../knowledge-level/knowledge-level-name-cell';
import { useModal } from '../../../generic/components/modals/confirm-action-modal';
import RenameModal from '../../../generic/components/modals/rename-modal';
import { Button } from '@nextui-org/button';
import { putOne } from '../../../api/READ-ONLY-generated-actions/KnowledgeDomain';

export function KnowledgeDomainNameCell({
  kd,
  nameList
}: {
  kd: KnowledgeDomainDto;
  nameList: string[];
}) {
  const { name, id } = kd;
  const renameContextKey = `knowledgeDomain:${name}`;
  const { currentState, dispatchUpdate } = useSelectiveContextControllerString(
    renameContextKey,
    renameContextKey,
    name
  );
  const { closeModal, isOpen, openModal } = useModal();
  const router = useRouter();
  const error = useValidationUniqueNonEmpty(currentState, name, nameList);

  const handleRenameKnowledgeDomain = () => {
    const update = { ...kd, name: currentState };
    putOne(update).then((r) => {
      router.refresh();
      closeModal();
    });
  };

  const handleCancel = () => {
    dispatchUpdate({ contextKey: renameContextKey, update: name });
    closeModal();
  };

  return (
    <>
      <Button onPress={openModal} size={'sm'} variant={'light'}>
        <PencilSquareIcon className={'w-4 h-4'} />{' '}
      </Button>
      <span className={'px-2'}>{name}</span>
      <RenameModal
        title={`Rename ${name}`}
        contextKey={renameContextKey}
        listenerKey={`${renameContextKey}:modal`}
        show={isOpen}
        onClose={closeModal}
        onConfirm={handleRenameKnowledgeDomain}
        onCancel={handleCancel}
        error={error}
      />
    </>
  );
}
