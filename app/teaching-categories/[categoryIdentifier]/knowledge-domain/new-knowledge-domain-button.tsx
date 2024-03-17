'use client';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { ServiceCategoryDto } from '../../../api/dtos/ServiceCategoryDtoSchema';
import { GenericButtonProps } from '../../../components/buttons/rename-button';
import {
  ConfirmActionModal,
  useModal
} from '../../../components/confirm-action-modal';
import {
  useSelectiveContextControllerString,
  useSelectiveContextDispatchString
} from '../../../components/selective-context/selective-context-manager-string';
import { KnowledgeDomainDto } from '../../../api/dtos/KnowledgeDomainDtoSchema';
import { TransientIdOffset } from '../../../graphing/editing/graph-edits';
import { TextInput, Title } from '@tremor/react';
import { useEffect, useTransition } from 'react';
import {
  useSelectiveContextControllerBoolean,
  useSelectiveContextDispatchBoolean
} from '../../../components/selective-context/selective-context-manager-boolean';
import { postKnowledgeDomain } from '../../../api/actions/service-categories';
import { useRouter } from 'next/navigation';
import { useValidationUniqueNonEmpty } from '../knowledge-level/knowledge-level-name-cell';
import {
  PendingOverlay,
  TextInputUniqueNonEmpty
} from '../knowledge-level/new-knowledge-level-button';
const NewKnowledgeDomainContextKey = 'new-knowledge-domain-name';

type NewKnowledgeDomainButtonProps = Omit<GenericButtonProps, 'onClick'> & {
  serviceCategory: ServiceCategoryDto;
  knowledgeDomainServiceCategoryNameList: string[];
};

function NewKnowledgeDomainPanel({
  serviceCategory: { knowledgeDomainDescriptor },
  nameList
}: {
  serviceCategory: ServiceCategoryDto;
  nameList: string[];
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
    <div className={'flex flex-col relative'}>
      <Title>Choose name for new {knowledgeDomainDescriptor}</Title>
      <TextInputUniqueNonEmpty
        nameList={nameList}
        currentState={currentState}
        error={confirmedWithoutName}
        setErrorFlag={setErrorFlag}
        dispatchWithoutControl={dispatchWithoutControl}
      />
    </div>
  );
}

export function NewKnowledgeDomainButton({
  serviceCategory,
  className,
  knowledgeDomainServiceCategoryNameList
}: NewKnowledgeDomainButtonProps) {
  const [pending, startTransition] = useTransition();
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
    } else if (knowledgeDomainServiceCategoryNameList.includes(currentState)) {
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
      startTransition(() => {
        postKnowledgeDomain(kdToPost)
          .then(() => {
            appRouterInstance.refresh();
          })
          .then(() => {
            setConfirmWithoutName({
              contextKey: NewKnowledgeDomainContextKey,
              value: false
            });
            dispatchUpdate({
              contextKey: NewKnowledgeDomainContextKey,
              value: ''
            });
            closeModal();
          })
          .catch((e) => {
            console.log(e);
          });
      });
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
        disabled={pending}
      >
        <PendingOverlay pending={pending} />
        <PlusCircleIcon className={'h-4 w-4'}></PlusCircleIcon>New
      </button>
      <ConfirmActionModal
        show={isOpen}
        onClose={closeModal}
        onConfirm={handleNewKnowledgeDomain}
        onCancel={closeModal}
        enterToConfirm={true}
      >
        {pending && (
          <div
            className={
              'w-full h-full absolute bg-slate-100 opacity-75 top-0 left-0 z-20 flex place-content-center'
            }
          >
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
        <NewKnowledgeDomainPanel
          serviceCategory={serviceCategory}
          nameList={knowledgeDomainServiceCategoryNameList}
        ></NewKnowledgeDomainPanel>
      </ConfirmActionModal>
    </>
  );
}
