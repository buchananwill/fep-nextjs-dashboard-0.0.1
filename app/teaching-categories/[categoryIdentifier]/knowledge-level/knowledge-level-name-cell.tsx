'use client';
import { KnowledgeDomainDto } from '../../../api/dtos/KnowledgeDomainDtoSchema';
import { RenameModal } from '../../../components/rename-modal/rename-modal';
import { useSelectiveContextControllerString } from '../../../generic/components/selective-context/selective-context-manager-string';
import { useModal } from '../../../components/modals/confirm-action-modal';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import {
  patchKnowledgeDomain,
  patchKnowledgeLevels
} from '../../../api/actions/service-categories';
import { useRouter } from 'next/navigation';
import { KnowledgeLevelDto } from '../../../api/dtos/KnowledgeLevelDtoSchema';
import { ServiceCategoryDto } from '../../../api/dtos/ServiceCategoryDtoSchema';
import { useEffect, useState } from 'react';

export function useValidationUniqueNonEmpty(
  proposedName: string,
  currentName: string,
  nameList: string[]
) {
  const [error, setError] = useState(false);

  useEffect(() => {
    if (proposedName !== currentName && nameList.includes(proposedName))
      setError(true);
    else if (proposedName == '' || proposedName == undefined) setError(true);
    else setError(false);
  }, [currentName, nameList, setError, proposedName]);
  return error;
}

export function KnowledgeLevelNameCell({
  kl,
  serviceCategory,
  nameList
}: {
  kl: KnowledgeLevelDto;
  serviceCategory: ServiceCategoryDto;
  nameList: string[];
}) {
  const { name, id } = kl;
  const renameContextKey = `knowledgeLevel:${id}`;
  const { currentState, dispatchUpdate } = useSelectiveContextControllerString(
    renameContextKey,
    renameContextKey,
    name
  );
  const { closeModal, isOpen, openModal } = useModal();
  const router = useRouter();
  const error = useValidationUniqueNonEmpty(currentState, name, nameList);

  const handleRenameKnowledgeLevel = () => {
    const update = { ...kl, name: currentState };
    patchKnowledgeLevels(serviceCategory, [update]).then((r) => {
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
      <span className={'px-2'}>{name}</span>
      <RenameModal
        title={`Rename ${name}`}
        contextKey={renameContextKey}
        listenerKey={`${renameContextKey}:modal`}
        show={isOpen}
        onClose={closeModal}
        onConfirm={handleRenameKnowledgeLevel}
        onCancel={handleCancel}
        error={error}
      />
    </div>
  );
}
