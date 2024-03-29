'use client';
import RatingTable from '../../../generic/components/tables/rating/rating-table';
import { RatingTableBody } from '../../../generic/components/tables/rating/rating-table-body';
import { IdStringFromNumberAccessor } from '../../../premises/classroom-suitability/rating-table-accessor-functions';
import { Card } from '@nextui-org/react';
import { useProviderRoleStringMapContext } from '../../contexts/providerRoles/provider-role-string-map-context-creator';
import { useSelectiveContextControllerNumberList } from '../../../selective-context/components/typed/selective-context-manager-number-list';
import { ProviderRoleSelectionList } from '../provider-role-disclosure-list-panel/provider-role-button-cluster';
import { EmptyArray } from '../../../api/main';
import { useMemoizedSelectionFromListAndStringMap } from '../../../premises/classroom-suitability/use-memoized-selection-from-list-and-string-map';
import { useWorkTaskTypeContext } from '../../../curriculum/delivery-models/contexts/use-work-task-type-context';

export default function SkillTableWrapper() {
  const { providerRoleDtoStringMap } = useProviderRoleStringMapContext();
  const { currentState: selectedProviders, dispatchUpdate } =
    useSelectiveContextControllerNumberList({
      contextKey: ProviderRoleSelectionList,
      initialValue: EmptyArray,
      listenerKey: 'skills-page'
    });

  const providerRoleDtos = useMemoizedSelectionFromListAndStringMap(
    selectedProviders,
    providerRoleDtoStringMap
  );
  const { workTaskTypeMap } = useWorkTaskTypeContext();

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
    <Card className={'max-w-[50%] p-2 m-0'}>
      <div className={'m-2 overflow-auto'}>
        <RatingTable
          ratedElements={providerRoleDtos}
          ratingCategories={allWorkTaskTypes}
          ratingCategoryDescriptor={'Skill'}
        >
          <RatingTableBody
            elementsWithRatings={providerRoleDtos}
            elementIdAccessor={IdStringFromNumberAccessor}
          />
        </RatingTable>
      </div>
    </Card>
  );
}
