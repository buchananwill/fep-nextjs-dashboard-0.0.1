'use client';
import RatingTable from '../rating-table';
import { useContext, useMemo } from 'react';
import { ProviderContext } from '../../contexts/providerRoles/provider-context';
import { ProviderRoleSelectionContext } from '../../contexts/providerRoles/provider-role-selection-context';
import { SkillEditContext } from '../../contexts/providerRoles/rating-edit-context';
import {
  providerRoleNameAccessor,
  SkillEditAccessorFunctions,
  workTaskCompetencyDtoListAccessor,
  workTaskCompetencyIdAccessor,
  workTaskCompetencyLabelAccessor,
  workTaskCompetencyRatingAccessor
} from './rating-table-accessor-functions';
import { RatingTableBody } from '../../../premises/classroom-suitability/rating-table-body';
import {
  IdAccessor,
  IdStringFromNumberAccessor
} from '../../../premises/classroom-suitability/rating-table-accessor-functions';
import {
  ProviderRoleStringMapContext,
  useProviderRoleStringMapContext
} from '../../contexts/providerRoles/provider-role-string-map-context-creator';
import { useMemoizedSelectionFromListAndStringMap } from '../../../premises/classroom-suitability/asset-suitability-table-wrapper';
import { useWorkTaskTypeContext } from '../../../curriculum/delivery-models/contexts/use-work-task-type-context';

export default function SkillsPage({}: {}) {
  const { providerRoleDtoStringMap } = useProviderRoleStringMapContext();
  const { selectedProviders } = useContext(ProviderRoleSelectionContext);
  const { workTaskTypeMap } = useWorkTaskTypeContext();

  const idList = useMemo(() => {
    return selectedProviders.map((tuple) => tuple.id);
  }, [selectedProviders]);

  const providerRoleDtos = useMemoizedSelectionFromListAndStringMap(
    idList,
    providerRoleDtoStringMap
  );

  const allWorkTaskTypes = Object.values(workTaskTypeMap).sort((wtt1, wtt2) =>
    wtt1.name.localeCompare(wtt2.name)
  );

  if (Object.keys(providerRoleDtoStringMap).length === 0) {
    return (
      <div className={'w-full h-fit bg-gray-400 text-black rounded-lg p-2'}>
        No teachers.
      </div>
    );
  }

  return (
    <RatingTable
      ratedElements={providerRoleDtos}
      ratingCategories={allWorkTaskTypes}
      ratingCategoryDescriptor={'Skill'}
    >
      <RatingTableBody
        elementsWithRatings={providerRoleDtos}
        listAccessor={SkillEditAccessorFunctions.ratingListAccessor}
        elementIdAccessor={IdStringFromNumberAccessor}
        elementLabelAccessor={SkillEditAccessorFunctions.elementLabelAccessor}
        ratingEditContext={SkillEditContext}
      />
    </RatingTable>
  );
}
