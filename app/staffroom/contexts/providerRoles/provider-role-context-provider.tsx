'use client';
import {
  ProviderContext,
  ProviderRoleContextInterface,
  ProviderRoleAndTaskData
} from './provider-context';
import { ReactNode, useContext, useEffect, useState } from 'react';
import {
  HUE_OPTIONS,
  LIGHTNESS_OPTIONS
} from '../../../contexts/color/color-context';
import { produce } from 'immer';
import {
  ColorCoding,
  ColorCodingDispatch
} from '../../../contexts/color-coding/context';

import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import { SkillEditContext } from './skill-edit-context';

import ProviderRoleSelectionContextProvider from './provider-role-selection-context-provider';
import { LongIdStringNameTuple } from '../../../api/dtos/LongIdStringNameTupleSchema';
import { performApiAction } from '../../../api/actions/performApiAction';
import { updateTeachers } from '../../../api/actions/provider-roles';
import { WorkTaskCompetencyDto } from '../../../api/dtos/WorkTaskCompetencyDtoSchema';
import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';
import {
  ConfirmActionModal,
  ConfirmActionModalProps
} from '../../../components/confirm-action-modal';

export default function ProviderRoleContextProvider({
  providerRoleAndTaskData,
  children
}: {
  providerRoleAndTaskData: ProviderRoleAndTaskData;
  children: ReactNode;
}) {
  const [selectedMechanics, setSelectedMechanics] = useState<
    LongIdStringNameTuple[]
  >([]);
  const [providerRoleDtos, setProviderRoles] = useState(
    providerRoleAndTaskData.providerRoles
  );

  console.log(providerRoleAndTaskData.workTaskTypes);

  const [open, setOpen] = useState(false);
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const providerRoleState: ProviderRoleContextInterface = {
    providers: providerRoleDtos,
    setProviders: setProviderRoles,
    workTaskTypes: providerRoleAndTaskData.workTaskTypes,
    unsavedChanges: unsavedChanges,
    setUnsavedChanges: setUnsavedChanges
  };

  const handleConfirm = () => {
    performApiAction(() => updateTeachers(providerRoleDtos)).then((r) => {
      if (r.status >= 200 && r.status < 400 && r.data) {
        setProviderRoles(r.data);
      }
    });
    setOpen(false);
    setUnsavedChanges(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  // const transactionalModal: TransactionalModalInterface = {
  //   open: open,
  //   confirm: handleConfirm,
  //   cancel: handleCancel
  // };

  const colorCodingState = useContext(ColorCoding);

  const { setColorCoding } = useContext(ColorCodingDispatch);

  const firstMechanic = providerRoleDtos[0];
  const [modalSkillValue, setModalSkillValue] = useState(0);
  const [skillInModal, setSkillInModal] = useState(
    firstMechanic?.workTaskCompetencyDtoList[0]
  );
  const [mechanicInModal, setProviderInModal] = useState(firstMechanic);

  const triggerModal = (
    skill: WorkTaskCompetencyDto,
    mechanic: ProviderRoleDto
  ) => {
    setProviderInModal(mechanic);
    setModalSkillValue(skill.competencyRating);
    setSkillInModal(skill);
    setSkillModalOpen(true);
  };

  function modifySkillValue(number: number) {
    const updatedValue = modalSkillValue + number;
    if (updatedValue > 5 || updatedValue < 0) return;
    setModalSkillValue(updatedValue);
  }

  const confirmSkillValue = () => {
    const updatedProviderState = produce(providerRoleDtos, (draft) => {
      const modifiedProvider = draft.find(
        (mechanic) => mechanic.id == mechanicInModal.id
      );
      if (modifiedProvider) {
        const modifiedSkill = modifiedProvider.workTaskCompetencyDtoList.find(
          (skill) => skill.workTaskTypeId == skillInModal?.workTaskTypeId
        );
        if (modifiedSkill) {
          modifiedSkill.competencyRating = modalSkillValue;
        }
      }
    });
    setProviderRoles(updatedProviderState);
    setUnsavedChanges(true);
  };

  const skillEditTransaction: ConfirmActionModalProps = {
    show: skillModalOpen,
    onConfirm: () => {
      confirmSkillValue();
      setSkillModalOpen(false);
    },
    onCancel: () => setSkillModalOpen(false),
    onClose: () => setSkillModalOpen(false)
  };

  useEffect(() => {
    const unColorCodedMechanics: string[] = [];

    providerRoleDtos.forEach(({ partyName }) => {
      if (!colorCodingState[partyName]) {
        unColorCodedMechanics.push(partyName);
      }
    });
    let currentState = colorCodingState;
    if (unColorCodedMechanics.length > 0) {
      for (let unColorCodedMechanic of unColorCodedMechanics) {
        const nextHueIndex =
          (Object.keys(currentState).length + 1) % HUE_OPTIONS.length;

        currentState = produce(currentState, (draft) => {
          draft[unColorCodedMechanic] = {
            hue: HUE_OPTIONS[nextHueIndex],
            lightness: LIGHTNESS_OPTIONS[1]
          };
        });
      }
      setColorCoding(currentState);
    }
  }, [colorCodingState, selectedMechanics, providerRoleDtos, setColorCoding]);

  return (
    <ProviderContext.Provider value={providerRoleState}>
      <ProviderRoleSelectionContextProvider>
        <SkillEditContext.Provider value={{ triggerModal: triggerModal }}>
          {children}
          {unsavedChanges && (
            <div
              className={
                'z-40 flex items-center border-gray-200 shadow-lg border-2 bg-gray-100 fixed top-16 right-16 p-2 rounded-md hover:bg-gray-50 group cursor-pointer'
              }
              onClick={() => setOpen(true)}
            >
              Unsaved Changes{' '}
              <ExclamationTriangleIcon
                className={
                  'p-1 h-8 w-8 text-red-500 group-hover:opacity-100 opacity-50 '
                }
              ></ExclamationTriangleIcon>
            </div>
          )}
          {mechanicInModal && (
            <ConfirmActionModal
              title={'Change Skill Value'}
              {...skillEditTransaction}
            >
              <div className="p-2 bg-gray-100 rounded-lg">
                <div className="font-light">{mechanicInModal.partyName}:</div>
                <div className="font-light flex py-2">
                  {skillInModal?.workTaskType}:
                  <div className="flex col px-2">
                    <button
                      className="border-2 rounded-md p-1 mx-1 hover:bg-gray-600 hover:text-gray-50"
                      onClick={() => modifySkillValue(-1)}
                    >
                      <MinusIcon className=" h-4 w-4"></MinusIcon>
                    </button>
                    <div
                      className={`w-7 rounded-md px-2 bg-${HUE_OPTIONS[modalSkillValue].id}-400 justify-center text-center`}
                    >
                      {modalSkillValue}
                    </div>
                    <button
                      className="border-2 rounded-md p-1 mx-1 hover:bg-gray-600 hover:text-gray-50"
                      onClick={() => modifySkillValue(1)}
                    >
                      <PlusIcon className=" h-4 w-4"></PlusIcon>
                    </button>
                  </div>
                </div>
              </div>
            </ConfirmActionModal>
          )}
          {/*<TransactionModal*/}
          {/*  title={'Update mechanic database'}*/}
          {/*  context={transactionalModal}*/}
          {/*>*/}
          {/*  <div>Send updated mechanic info to database?</div>*/}
          {/*</TransactionModal>*/}
        </SkillEditContext.Provider>
      </ProviderRoleSelectionContextProvider>
    </ProviderContext.Provider>
  );
}
