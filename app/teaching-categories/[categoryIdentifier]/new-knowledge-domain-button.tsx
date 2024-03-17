'use client';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { ServiceCategoryDto } from '../../api/dtos/ServiceCategoryDtoSchema';
import { GenericButtonProps } from '../../components/buttons/rename-button';
import {
  ConfirmActionModal,
  useModal
} from '../../components/confirm-action-modal';
import {
  useSelectiveContextControllerString,
  useSelectiveContextDispatchString
} from '../../components/selective-context/selective-context-manager-string';
import { KnowledgeDomainDto } from '../../api/dtos/KnowledgeDomainDtoSchema';
import { TransientIdOffset } from '../../graphing/editing/graph-edits';
import { TextInput, Title } from '@tremor/react';
import { useState } from 'react';
import {
  useSelectiveContextControllerBoolean,
  useSelectiveContextDispatchBoolean
} from '../../components/selective-context/selective-context-manager-boolean';
import { postEntity } from '../../api/actions/template-actions';
import { postKnowledgeDomain } from '../../api/actions/service-categories';
import { useRouter } from 'next/navigation';
const NewKnowledgeDomainContextKey = 'new-knowledge-domain-name';

type NewKnowledgeDomainButtonProps = Omit<GenericButtonProps, 'onClick'> & {
  serviceCategory: ServiceCategoryDto;
};

function NewKnowledgeDomainPanel({
  serviceCategory: { knowledgeDomainDescriptor }
}: {
  serviceCategory: ServiceCategoryDto;
}) {
  const { currentState, dispatchWithoutControl } =
    useSelectiveContextDispatchString(
      NewKnowledgeDomainContextKey,
      'modal',
      ''
    );
  const {
    currentState: confirmedWithoutName,
    dispatchWithoutControl: setErrorFlag
  } = useSelectiveContextDispatchBoolean(
    NewKnowledgeDomainContextKey,
    'modal',
    false
  );

  return (
    <div className={'flex flex-col'}>
      <Title>Choose name for new {knowledgeDomainDescriptor}</Title>
      <TextInput
        value={currentState}
        onValueChange={(value: string) => {
          if (value === '') setErrorFlag(true);
          dispatchWithoutControl(value);
        }}
        error={confirmedWithoutName}
        errorMessage={'Please enter a name'}
      ></TextInput>
    </div>
  );
}

export function NewKnowledgeDomainButton({
  serviceCategory,
  className
}: NewKnowledgeDomainButtonProps) {
  const appRouterInstance = useRouter();
  const { isOpen, closeModal, openModal } = useModal();

  const { currentState, dispatchUpdate } = useSelectiveContextControllerString(
    NewKnowledgeDomainContextKey,
    'button',
    ''
  );

  const {
    currentState: confirmedWithoutName,
    dispatchUpdate: setConfirmWithoutName
  } = useSelectiveContextControllerBoolean(
    NewKnowledgeDomainContextKey,
    'button',
    false
  );

  const handleNewKnowledgeDomain = () => {
    if (currentState === '') {
      setConfirmWithoutName({
        contextKey: NewKnowledgeDomainContextKey,
        value: true
      });
    } else {
      const kdToPost: KnowledgeDomainDto = {
        id: TransientIdOffset,
        name: currentState,
        serviceCategoryId: serviceCategory.id,
        workTaskTypeCount: 0,
        knowledgeDomainDescriptor: serviceCategory.knowledgeDomainDescriptor
      };
      postKnowledgeDomain(kdToPost).then(() => {
        appRouterInstance.refresh();
      });
      setConfirmWithoutName({
        contextKey: NewKnowledgeDomainContextKey,
        value: false
      });
      console.log();
      closeModal();
    }
  };

  return (
    <>
      <button
        className={className}
        onClick={() => {
          setConfirmWithoutName({
            contextKey: NewKnowledgeDomainContextKey,
            value: false
          });
          openModal();
        }}
      >
        <PlusCircleIcon className={'h-4 w-4'}></PlusCircleIcon>New
      </button>
      <ConfirmActionModal
        show={isOpen}
        onClose={closeModal}
        onConfirm={handleNewKnowledgeDomain}
        onCancel={closeModal}
        enterToConfirm={true}
      >
        <NewKnowledgeDomainPanel
          serviceCategory={serviceCategory}
        ></NewKnowledgeDomainPanel>
      </ConfirmActionModal>
    </>
  );
}
