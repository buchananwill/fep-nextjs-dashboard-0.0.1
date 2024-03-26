'use client';
import { ReactNode } from 'react';
import { SkillEditContext } from '../../../generic/components/tables/rating/rating-edit-context';
import { WorkTaskCompetencyDto } from '../../../api/dtos/WorkTaskCompetencyDtoSchema';
import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';
import { RatingEditModal } from '../../../generic/components/modals/rating-edit-modal';
import {
  SkillEditAccessorFunctions,
  workTaskCompetencyIdAccessor
} from '../../teachers/skills/rating-table-accessor-functions';
import { useWorkTaskCompetencyListDispatch } from '../../../contexts/selective-context/work-task-competency-list-selective-context-provider';
import { useConfirmRatingValueFunction } from '../../../premises/use-confirm-rating-value-function';
import { IdStringFromNumberAccessor } from '../../../premises/classroom-suitability/rating-table-accessor-functions';
import { getCurriedProducer } from './get-curried-producer';
import { UnsavedProviderRoleChanges } from './provider-role-string-map-context-creator';
import { useSelectiveContextListenerReadAll } from '../../../generic/components/selective-context/generic-selective-context-creator';
import { WorkTaskCompetencyListSelectiveContext } from '../../../contexts/selective-context/selective-context-creators';

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
