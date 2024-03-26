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
import { useSelectiveContextListenerReadAll } from '../../../components/selective-context/generic/generic-selective-context-creator';
import { WorkTaskCompetencyListSelectiveContext } from '../../../components/selective-context/typed/selective-context-creators';

const skillProducer = getCurriedProducer<WorkTaskCompetencyDto, number>(
  (task, value) => (task.competencyRating = value)
);

const skillListProducer = getCurriedProducer<
  ProviderRoleDto,
  WorkTaskCompetencyDto[]
>((providerRole, list) => (providerRole.workTaskCompetencyDtoList = list));

export default function ProviderRoleSkillEditContextProvider({
  children
}: {
  children: ReactNode;
}) {
  const selectiveContextReadAll = useSelectiveContextListenerReadAll(
    WorkTaskCompetencyListSelectiveContext
  );

  const confirmRatingValue = useConfirmRatingValueFunction(
    useWorkTaskCompetencyListDispatch,
    selectiveContextReadAll,
    workTaskCompetencyIdAccessor,
    skillProducer,
    skillListProducer,
    IdStringFromNumberAccessor,
    UnsavedProviderRoleChanges,
    'provider'
  );

  return (
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
  );
}
