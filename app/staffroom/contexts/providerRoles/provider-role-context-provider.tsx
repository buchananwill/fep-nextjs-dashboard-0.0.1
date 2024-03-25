'use client';
import {
  ProviderContext,
  ProviderRoleAndTaskData,
  ProviderRoleContextInterface
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
import { RatingEditContext, SkillEditContext } from './rating-edit-context';

import ProviderRoleSelectionContextProvider from './provider-role-selection-context-provider';
import { LongIdStringNameTuple } from '../../../api/dtos/LongIdStringNameTupleSchema';
import { updateTeachers } from '../../../api/actions/provider-roles';
import { WorkTaskCompetencyDto } from '../../../api/dtos/WorkTaskCompetencyDtoSchema';
import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';
import { ConfirmActionModalProps } from '../../../components/confirm-action-modal';
import { RatingEditModal } from './rating-edit-modal';
import {
  providerRoleNameAccessor,
  SkillEditAccessorFunctions,
  workTaskCompetencyDtoListAccessor,
  workTaskCompetencyLabelAccessor,
  workTaskCompetencyRatingAccessor
} from '../../teachers/skills/rating-table-accessor-functions';
import {
  UnsavedChangesModal,
  UnsavedChangesProps
} from '../../../components/unsaved-changes-modal';
import { useRatingEditModal } from './use-rating-edit-modal';
import { nameAccessor } from '../../../curriculum/delivery-models/[yearGroup]/curriculum-model-name-list-validator';
import { isNotUndefined } from '../../../api/main';

export default function ProviderRoleContextProvider({
  providerRoleAndTaskData,
  children
}: {
  providerRoleAndTaskData: ProviderRoleAndTaskData;
  children: ReactNode;
}) {
  const [selectedProviderRoles, setSelectedProviderRoles] = useState<
    LongIdStringNameTuple[]
  >([]);
  const [providerRoleDtos, setProviderRoles] = useState(
    providerRoleAndTaskData.providerRoles
  );

  const [open, setOpen] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const providerRoleState: ProviderRoleContextInterface = {
    providers: providerRoleDtos,
    setProviders: setProviderRoles,
    workTaskTypes: providerRoleAndTaskData.workTaskTypes,
    unsavedChanges: unsavedChanges,
    setUnsavedChanges: setUnsavedChanges
  };

  const handleConfirm = () => {
    console.log('Updating...');

    Promise.all(providerRoleDtos.map((pr) => updateTeachers([pr])))
      .then((responseArray) => {
        return responseArray
          .map((r) => r.data)
          .filter(isNotUndefined)
          .reduce((prev, curr, index, filteredArray) => [...prev, ...curr], []);
      })
      .then((r) => {
        console.log(r);
      });
    // updateTeachers(providerRoleDtos).then((r) => {
    //   console.log('received response:', r);
    //   if (r.status >= 200 && r.status < 400 && r.data) {
    //     setProviderRoles(r.data);
    //   }
    // });
    setOpen(false);
    setUnsavedChanges(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const transactionalModal: ConfirmActionModalProps & UnsavedChangesProps = {
    unsavedChanges,
    title: 'Update Teacher database',
    show: open,
    onConfirm: handleConfirm,
    onCancel: handleCancel,
    onClose: () => setOpen(false),
    handleOpen: () => setOpen(true)
  };

  const colorCodingState = useContext(ColorCoding);

  const { setColorCoding } = useContext(ColorCodingDispatch);

  const confirmSkillValue = (
    skillInModal: WorkTaskCompetencyDto,
    providerRoleDtoInModal: ProviderRoleDto,
    modalSkillValue: number
  ) => {
    const updatedProviderState = produce(providerRoleDtos, (draft) => {
      const modifiedProvider = draft.find(
        (mechanic) => mechanic.id == providerRoleDtoInModal.id
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

  const { triggerModal, ratingEditModalProps, elementInModal } =
    useRatingEditModal<WorkTaskCompetencyDto, ProviderRoleDto>({
      confirmRatingValue: confirmSkillValue,
      ratingValueAccessor: workTaskCompetencyRatingAccessor,
      ratingCategoryLabelAccessor: workTaskCompetencyLabelAccessor,
      nameAccessor: providerRoleNameAccessor
    });

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
  }, [
    colorCodingState,
    selectedProviderRoles,
    providerRoleDtos,
    setColorCoding
  ]);

  return (
    <ProviderContext.Provider value={providerRoleState}>
      <ProviderRoleSelectionContextProvider>
        <SkillEditContext.Provider
          value={{
            triggerModal: triggerModal,
            ...SkillEditAccessorFunctions
          }}
        >
          {children}
          <UnsavedChangesModal {...transactionalModal} />

          {elementInModal && <RatingEditModal {...ratingEditModalProps} />}
        </SkillEditContext.Provider>
      </ProviderRoleSelectionContextProvider>
    </ProviderContext.Provider>
  );
}
