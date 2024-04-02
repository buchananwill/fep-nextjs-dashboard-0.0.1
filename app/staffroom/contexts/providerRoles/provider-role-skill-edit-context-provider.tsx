'use client';
import { ReactNode } from 'react';
import { GenericRatingEditContext } from '../../../generic/components/tables/rating/rating-edit-context';
import { WorkTaskCompetencyDto } from '../../../api/dtos/WorkTaskCompetencyDtoSchema';
import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';
import { RatingEditModal } from '../../../generic/components/modals/rating-edit-modal';
import {
  SkillEditAccessorFunctions,
  workTaskCompetencyIdAccessor
} from '../../teachers/skills/rating-table-accessor-functions';
import { useWorkTaskCompetencyListDispatch } from '../../../contexts/selective-context/work-task-competency-list-selective-context-provider';
import { useConfirmRatingValueFunction } from '../../../selective-context/hooks/derived/use-confirm-rating-value-function';
import { IdStringFromNumberAccessor } from '../../../premises/classroom-suitability/rating-table-accessor-functions';
import { getCurriedProducer } from './get-curried-producer';
import { UnsavedProviderRoleChanges } from './provider-role-string-map-context-creator';
import { useSelectiveContextListenerReadAll } from '../../../selective-context/components/base/generic-selective-context-creator';
import { ProviderRoleTypeWorkTaskTypeSuitabilityListSelectiveContext } from '../../../contexts/selective-context/selective-context-creators';
import { ProviderRoleTypeWorkTaskTypeSuitabilityDto } from '../../../api/dtos/ProviderRoleTypeWorkTaskTypeSuitabilityDtoSchema';

const skillProducer = getCurriedProducer<
  ProviderRoleTypeWorkTaskTypeSuitabilityDto,
  number
>((task, value) => (task.rating = value));

export default function ProviderRoleSkillEditContextProvider({
  children
}: {
  children: ReactNode;
}) {
  const selectiveContextReadAll = useSelectiveContextListenerReadAll(
    ProviderRoleTypeWorkTaskTypeSuitabilityListSelectiveContext
  );

  const confirmRatingValue = useConfirmRatingValueFunction(
    useWorkTaskCompetencyListDispatch,
    selectiveContextReadAll,
    workTaskCompetencyIdAccessor,
    skillProducer,
    IdStringFromNumberAccessor,
    UnsavedProviderRoleChanges,
    'edit-context-provider'
  );

  return (
    <GenericRatingEditContext.Provider
      value={{
        useRatingListDispatchHook: useWorkTaskCompetencyListDispatch,
        confirmRatingValue: confirmRatingValue,
        ratingProducer: skillProducer,
        unsavedChangesKey: UnsavedProviderRoleChanges,
        unsavedChangesListKey: UnsavedProviderRoleChanges,
        ratingListAccessor: selectiveContextReadAll,
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
    </GenericRatingEditContext.Provider>
  );
}
