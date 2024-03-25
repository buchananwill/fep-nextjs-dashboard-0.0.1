'use client';
import { ProviderRoleAndTaskData } from './provider-context';
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
import { SkillEditContext } from './rating-edit-context';

import ProviderRoleSelectionContextProvider from './provider-role-selection-context-provider';
import { LongIdStringNameTuple } from '../../../api/dtos/LongIdStringNameTupleSchema';
import { WorkTaskCompetencyDto } from '../../../api/dtos/WorkTaskCompetencyDtoSchema';
import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';
import { RatingEditModal } from './rating-edit-modal';
import {
  SkillEditAccessorFunctions,
  workTaskCompetencyDtoListAccessor,
  workTaskCompetencyIdAccessor
} from '../../teachers/skills/rating-table-accessor-functions';

import { useWorkTaskCompetencyListDispatch } from '../../../components/selective-context/typed/work-task-competency-list-selective-context-provider';
import { useConfirmRatingValueFunction } from '../../../premises/use-confirm-rating-value-function';
import { IdStringFromNumberAccessor } from '../../../premises/classroom-suitability/rating-table-accessor-functions';
import { getCurriedProducer } from './get-curried-producer';
import { UnsavedProviderRoleChanges } from './provider-role-string-map-context-creator';

const skillProducer = getCurriedProducer<WorkTaskCompetencyDto, number>(
  (task, value) => (task.competencyRating = value)
);

const skillListProducer = getCurriedProducer<
  ProviderRoleDto,
  WorkTaskCompetencyDto[]
>((providerRole, list) => (providerRole.workTaskCompetencyDtoList = list));

export default function ProviderRoleSkillEditContextProvider({
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

  const colorCodingState = useContext(ColorCoding);

  const { setColorCoding } = useContext(ColorCodingDispatch);

  const confirmRatingValue = useConfirmRatingValueFunction(
    useWorkTaskCompetencyListDispatch,
    workTaskCompetencyDtoListAccessor,
    workTaskCompetencyIdAccessor,
    skillProducer,
    skillListProducer,
    IdStringFromNumberAccessor,
    UnsavedProviderRoleChanges,
    'provider'
  );

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
    <ProviderRoleSelectionContextProvider>
      <SkillEditContext.Provider
        value={{
          useRatingListDispatchHook: useWorkTaskCompetencyListDispatch,
          confirmRatingValue: confirmRatingValue,
          ...SkillEditAccessorFunctions
        }}
      >
        {children}

        <RatingEditModal
          confirmRatingValue={confirmRatingValue}
          nameAccessor={SkillEditAccessorFunctions.elementLabelAccessor}
          ratingCategoryLabelAccessor={
            SkillEditAccessorFunctions.ratingCategoryLabelAccessor
          }
          ratingValueAccessor={SkillEditAccessorFunctions.ratingValueAccessor}
        />
      </SkillEditContext.Provider>
    </ProviderRoleSelectionContextProvider>
  );
}
