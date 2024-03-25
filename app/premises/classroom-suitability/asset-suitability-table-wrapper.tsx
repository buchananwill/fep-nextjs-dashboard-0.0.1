'use client';
import { AssetSuitabilityEditContext } from '../../staffroom/contexts/providerRoles/rating-edit-context';
import RatingTable from '../../staffroom/teachers/rating-table';
import {
  assetRoleWorkTaskSuitabilityDtoListAccessor,
  AssetSuitabilityAccessorFunctions,
  IdStringFromNumberAccessor
} from './rating-table-accessor-functions';
import { useWorkTaskTypeContext } from '../../curriculum/delivery-models/contexts/use-work-task-type-context';
import { useSelectiveContextControllerNumberList } from '../../components/selective-context/selective-context-manager-number-list';
import { StringMap } from '../../curriculum/delivery-models/contexts/string-map-context-creator';
import { useMemo } from 'react';
import { useAssetStringMapContext } from '../asset-string-map-context-creator';
import { Card } from '@tremor/react';
import { isNotNull } from '../../api/main';
import { RatingTableBody } from './rating-table-body';

export const EmptyNumberIdArray: number[] = [];
export const StaticNumberIdArray: number[] = [20];

export function useMemoizedSelectionFromListAndStringMap<T>(
  selectedList: number[],
  ratedElements: StringMap<T>
) {
  return useMemo(() => {
    return selectedList
      .map((id) => ratedElements[id.toString()])
      .filter(isNotNull<T>);
  }, [selectedList, ratedElements]);
}

const assetSuitabilityTableWrapperListenerKey =
  'asset-suitability-table-wrapper';

export const AssetSelectionListContextKey = 'asset-selection-list';

const workTaskTypeSelectionListContextKey = 'work-task-type-selection-list';

export function AssetSuitabilityTableWrapper() {
  const { workTaskTypeMap } = useWorkTaskTypeContext();
  const { assetDtoStringMap } = useAssetStringMapContext();
  const { currentState: selectedAssetList } =
    useSelectiveContextControllerNumberList({
      contextKey: AssetSelectionListContextKey,
      listenerKey: assetSuitabilityTableWrapperListenerKey,
      initialValue: EmptyNumberIdArray
    });

  const { currentState: selectedWorkTaskTypeList } =
    useSelectiveContextControllerNumberList({
      contextKey: workTaskTypeSelectionListContextKey,
      listenerKey: assetSuitabilityTableWrapperListenerKey,
      initialValue: StaticNumberIdArray
    });
  const assetDtos = useMemoizedSelectionFromListAndStringMap(
    selectedAssetList,
    assetDtoStringMap
  );
  const workTaskTypeDtos = useMemoizedSelectionFromListAndStringMap(
    selectedWorkTaskTypeList,
    workTaskTypeMap
  );

  const allWorkTaskTypes = Object.values(workTaskTypeMap).sort((wtt1, wtt2) =>
    wtt1.name.localeCompare(wtt2.name)
  );

  return (
    <Card className={'max-w-[75%] max-h-[75vh] p-0'}>
      <div
        className={
          'max-w-full max-h-full overflow-auto box-border border-8 border-transparent'
        }
      >
        <RatingTable
          ratedElements={assetDtos}
          ratingCategories={allWorkTaskTypes}
          ratingCategoryDescriptor={'Lesson Type'}
        >
          <RatingTableBody
            elementsWithRatings={assetDtos}
            listAccessor={assetRoleWorkTaskSuitabilityDtoListAccessor}
            elementIdAccessor={IdStringFromNumberAccessor}
            elementLabelAccessor={
              AssetSuitabilityAccessorFunctions.elementLabelAccessor
            }
            ratingEditContext={AssetSuitabilityEditContext}
          />
        </RatingTable>
      </div>
    </Card>
  );
}
