'use client';
import { KnowledgeDomainDto } from '../../api/dtos/KnowledgeDomainDtoSchema';
import { RenameModal } from '../../components/rename-modal/rename-modal';
import { useSelectiveContextControllerString } from '../../components/selective-context/selective-context-manager-string';
import { useModal } from '../../components/confirm-action-modal';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import { patchKnowledgeDomain } from '../../api/actions/service-categories';
import { useRouter } from 'next/navigation';

export function KnowledgeDomainNameCell({ kd }: { kd: KnowledgeDomainDto }) {
  const { name, id } = kd;
  const renameContextKey = `knowledgeDomain:${name}`;
  const { currentState, dispatchUpdate } = useSelectiveContextControllerString(
    renameContextKey,
    renameContextKey,
    name
  );
  const { closeModal, isOpen, openModal } = useModal();
  const router = useRouter();

  const handleRenameKnowledgeDomain = () => {
    const update = { ...kd, name: currentState };
    patchKnowledgeDomain(update).then((r) => {
      router.refresh();
      closeModal();
    });
  };

  const handleCancel = () => {
    dispatchUpdate({ contextKey: renameContextKey, value: name });
    closeModal();
  };

  return (
    <div className={'flex items-center px-2'}>
      <button onClick={openModal} className={'btn btn-ghost btn-sm'}>
        <PencilSquareIcon className={'w-4 h-4'} />{' '}
      </button>
      {name}
      <RenameModal
        contextKey={renameContextKey}
        listenerKey={`${renameContextKey}:modal`}
        show={isOpen}
        onClose={closeModal}
        onConfirm={handleRenameKnowledgeDomain}
        onCancel={handleCancel}
      />
    </div>
  );
}
