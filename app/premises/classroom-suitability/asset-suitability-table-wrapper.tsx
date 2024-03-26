'use client';
import { AssetSuitabilityEditContext } from '../../staffroom/contexts/providerRoles/rating-edit-context';
import RatingTable, {
  AccessorFunction
} from '../../staffroom/teachers/rating-table';
import {
  AssetSuitabilityAccessorFunctions,
  IdStringFromNumberAccessor
} from './rating-table-accessor-functions';
import { useWorkTaskTypeContext } from '../../curriculum/delivery-models/contexts/use-work-task-type-context';
import { useSelectiveContextControllerNumberList } from '../../generic/components/selective-context/selective-context-manager-number-list';
import { StringMap } from '../../curriculum/delivery-models/contexts/string-map-context-creator';
import { useCallback, useMemo } from 'react';
import { useAssetStringMapContext } from '../asset-string-map-context-creator';
import { Card } from '@tremor/react';
import { isNotNull } from '../../api/main';
import { RatingTableBody } from './rating-table-body';
import {
  SelectiveContext,
  useSelectiveContextListenerReadAll
} from '../../generic/components/selective-context/generic-selective-context-creator';
import { AssetSuitabilityListSelectiveContext } from '../../components/selective-context/typed/selective-context-creators';
import { AssetDto } from '../../api/dtos/AssetDtoSchema';

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

export function useSelectiveContextRatingListAccessor<R, E>(
  context: SelectiveContext<R[]>,
  keyAccessor: AccessorFunction<E, string>
) {
  const selectiveContextReadAll = useSelectiveContextListenerReadAll(context);

  return useCallback(
    (elementWithRatings: E) =>
      selectiveContextReadAll(keyAccessor(elementWithRatings)),
    [selectiveContextReadAll, keyAccessor]
  );
}

export function AssetSuitabilityTableWrapper() {
  const { workTaskTypeMap } = useWorkTaskTypeContext();
  const { assetDtoStringMap } = useAssetStringMapContext();
  const { currentState: selectedAssetList } =
    useSelectiveContextControllerNumberList({
      contextKey: AssetSelectionListContextKey,
      listenerKey: assetSuitabilityTableWrapperListenerKey,
      initialValue: EmptyNumberIdArray
    });
  const selectiveContextListAccessor = useSelectiveContextRatingListAccessor(
    AssetSuitabilityListSelectiveContext,
    IdStringFromNumberAccessor
  );

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
            listAccessor={selectiveContextListAccessor}
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
