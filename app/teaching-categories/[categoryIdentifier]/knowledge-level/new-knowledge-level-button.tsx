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
import { TransientIdOffset } from '../../../graphing/editing/functions/graph-edits';
import { TextInput, Title } from '@tremor/react';
import {
  useSelectiveContextControllerBoolean,
  useSelectiveContextDispatchBoolean
} from '../../../components/selective-context/selective-context-manager-boolean';
import { postKnowledgeLevel } from '../../../api/actions/service-categories';
import { useRouter } from 'next/navigation';
import { KnowledgeLevelDto } from '../../../api/dtos/KnowledgeLevelDtoSchema';
import { useTransition } from 'react';
import { PendingOverlay } from '../../../components/pending-overlay';

const NewKnowledgeLevelContextKey = 'new-knowledge-Level-name';

type NewKnowledgeLevelButtonProps = Omit<GenericButtonProps, 'onClick'> & {
  serviceCategory: ServiceCategoryDto;
  knowledgeLevelNameList: string[];
};

function NewKnowledgeLevelPanel({
  serviceCategory: { knowledgeLevelDescriptor },
  nameList
}: {
  serviceCategory: ServiceCategoryDto;
  nameList: string[];
}) {
  const { currentState, dispatchWithoutControl } =
    useSelectiveContextDispatchString(NewKnowledgeLevelContextKey, 'modal', '');
  const { currentState: errorFlag, dispatchWithoutControl: setErrorFlag } =
    useSelectiveContextDispatchBoolean(
      NewKnowledgeLevelContextKey,
      'modal',
      false
    );

  return (
    <div className={'flex flex-col'}>
      <Title>Choose name for new {knowledgeLevelDescriptor}</Title>
      <TextInputUniqueNonEmpty
        nameList={nameList}
        currentState={currentState}
        error={errorFlag}
        dispatchWithoutControl={dispatchWithoutControl}
        setErrorFlag={setErrorFlag}
      />
    </div>
  );
}

export function TextInputUniqueNonEmpty({
  currentState,
  setErrorFlag,
  dispatchWithoutControl,
  error,
  nameList
}: {
  nameList: string[];
  currentState: string | undefined;
  setErrorFlag?: (flag: boolean) => void;
  dispatchWithoutControl?: (value: string) => void;
  error: boolean;
}) {
  if (setErrorFlag === undefined || dispatchWithoutControl === undefined)
    return null;

  return (
    <TextInput
      value={currentState}
      onValueChange={(value: string) => {
        if (value === '' || nameList.includes(value)) setErrorFlag(true);
        else setErrorFlag(false);
        dispatchWithoutControl(value);
      }}
      error={error}
      errorMessage={'Please enter a unique name.'}
    ></TextInput>
  );
}

export function NewKnowledgeLevelButton({
  serviceCategory,
  className,
  knowledgeLevelNameList
}: NewKnowledgeLevelButtonProps) {
  const appRouterInstance = useRouter();
  const { isOpen, closeModal, openModal } = useModal();
  const [pending, startTransition] = useTransition();

  const { currentState, dispatchUpdate } = useSelectiveContextControllerString(
    NewKnowledgeLevelContextKey,
    'button',
    ''
  );

  const {
    currentState: confirmedWithoutName,
    dispatchUpdate: setConfirmWithoutName
  } = useSelectiveContextControllerBoolean(
    NewKnowledgeLevelContextKey,
    'button',
    false
  );

  const handleNewKnowledgeLevel = () => {
    if (currentState === '') {
      setConfirmWithoutName({
        contextKey: NewKnowledgeLevelContextKey,
        value: true
      });
    } else if (knowledgeLevelNameList.includes(currentState)) {
      setConfirmWithoutName({
        contextKey: NewKnowledgeLevelContextKey,
        value: true
      });
    } else {
      const kdToPost: KnowledgeLevelDto = {
        id: TransientIdOffset,
        name: currentState,
        serviceCategoryId: serviceCategory.id,
        workTaskTypeCount: 0,
        knowledgeLevelDescriptor: serviceCategory.knowledgeLevelDescriptor,
        levelOrdinal: NaN
      };
      postKnowledgeLevel(kdToPost)
        .then(() => {
          appRouterInstance.refresh();
        })
        .then(() => {
          setConfirmWithoutName({
            contextKey: NewKnowledgeLevelContextKey,
            value: false
          });
          dispatchUpdate({
            contextKey: NewKnowledgeLevelContextKey,
            value: ''
          });
          closeModal();
        });
    }
  };

  return (
    <>
      <button
        className={className}
        onClick={() => {
          setConfirmWithoutName({
            contextKey: NewKnowledgeLevelContextKey,
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
        onConfirm={handleNewKnowledgeLevel}
        onCancel={closeModal}
        enterToConfirm={true}
      >
        <NewKnowledgeLevelPanel
          serviceCategory={serviceCategory}
          nameList={knowledgeLevelNameList}
        ></NewKnowledgeLevelPanel>
      </ConfirmActionModal>
    </>
  );
}
