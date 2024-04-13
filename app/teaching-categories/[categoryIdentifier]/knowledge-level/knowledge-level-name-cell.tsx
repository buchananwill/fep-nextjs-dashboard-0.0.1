'use client';

import { useSelectiveContextControllerString } from '../../../selective-context/components/typed/selective-context-manager-string';

import { PencilSquareIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';
import { KnowledgeLevelDto } from '../../../api/dtos/KnowledgeLevelDtoSchema';
import { ServiceCategoryDto } from '../../../api/dtos/ServiceCategoryDtoSchema';
import { useEffect, useState } from 'react';
import { useModal } from '../../../generic/components/modals/confirm-action-modal';
import RenameModal from '../../../generic/components/modals/rename-modal';
import { Button } from '@nextui-org/button';
import { putOne } from '../../../api/READ-ONLY-generated-actions/KnowledgeLevel';

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
  const { onClose, show, openModal } = useModal();
  const router = useRouter();
  const error = useValidationUniqueNonEmpty(currentState, name, nameList);

  const handleRenameKnowledgeLevel = () => {
    const update = { ...kl, name: currentState };
    putOne(update).then(() => {
      router.refresh();
      onClose();
    });
  };

  const handleCancel = () => {
    dispatchUpdate({ contextKey: renameContextKey, update: name });
    onClose();
  };

  return (
    <div className={'flex items-center px-2'}>
      <Button onPress={openModal} size={'sm'} variant={'light'}>
        <PencilSquareIcon className={'w-4 h-4'} />{' '}
      </Button>
      <span className={'px-2'}>{name}</span>
      <RenameModal
        title={`Rename ${name}`}
        contextKey={renameContextKey}
        listenerKey={`${renameContextKey}:modal`}
        show={show}
        onClose={onClose}
        onConfirm={handleRenameKnowledgeLevel}
        onCancel={handleCancel}
        error={error}
      />
    </div>
  );
}
