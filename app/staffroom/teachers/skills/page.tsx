'use client';
import RatingTable from '../../../generic/components/tables/rating/rating-table';
import { useContext, useMemo } from 'react';
import { ProviderRoleSelectionContext } from '../../contexts/providerRoles/provider-role-selection-context';
import { SkillEditContext } from '../../../generic/components/tables/rating/rating-edit-context';
import { SkillEditAccessorFunctions } from './rating-table-accessor-functions';
import { RatingTableBody } from '../../../generic/components/tables/rating/rating-table-body';
import { IdStringFromNumberAccessor } from '../../../premises/classroom-suitability/rating-table-accessor-functions';
import { useProviderRoleStringMapContext } from '../../contexts/providerRoles/provider-role-string-map-context-creator';
import { useWorkTaskTypeContext } from '../../../curriculum/delivery-models/contexts/use-work-task-type-context';
import { WorkTaskCompetencyListSelectiveContext } from '../../../contexts/selective-context/selective-context-creators';
import { useMemoizedSelectionFromListAndStringMap } from '../../../premises/classroom-suitability/use-memoized-selection-from-list-and-string-map';
import { useSelectiveContextRatingListAccessor } from '../../../premises/classroom-suitability/use-selective-context-rating-list-accessor';

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

  const selectiveContextListAccessor = useSelectiveContextRatingListAccessor(
    WorkTaskCompetencyListSelectiveContext,
    IdStringFromNumberAccessor
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
        listAccessor={selectiveContextListAccessor}
        elementIdAccessor={IdStringFromNumberAccessor}
        elementLabelAccessor={SkillEditAccessorFunctions.elementLabelAccessor}
        ratingEditContext={SkillEditContext}
      />
    </RatingTable>
  );
}
