'use client';
import { AssetSuitabilityEditContext } from '../../staffroom/contexts/providerRoles/rating-edit-context';
import RatingTable from '../../staffroom/teachers/rating-table';
import {
  assetNameAccessor,
  assetRoleWorkTaskSuitabilityDtoListAccessor,
  assetRoleWorkTaskSuitabilityLabelAccessor,
  assetRoleWorkTaskSuitabilityRatingAccessor
} from './rating-table-accessor-functions';
import { useWorkTaskTypeContext } from '../../curriculum/delivery-models/contexts/use-work-task-type-context';
import { AssetDto } from '../../api/dtos/AssetDtoSchema';
import { useSelectiveContextControllerNumberList } from '../../components/selective-context/selective-context-manager-number-list';
import { StringMap } from '../../curriculum/delivery-models/contexts/string-map-context-creator';
import { useMemo } from 'react';
import { isNotNull } from '../../graphing/editing/functions/graph-edits';
import { useAssetStringMapContext } from '../asset-string-map-context-creator';

interface AssetSuitabilityTableProps {
  ratedElements: StringMap<AssetDto>;
}

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

export function AssetSuitabilityTableWrapper({
  ratedElements
}: AssetSuitabilityTableProps) {
  const { workTaskTypeMap } = useWorkTaskTypeContext();
  const { assetDtoStringMap } = useAssetStringMapContext();
  const { dispatchUpdate, currentState: selectedAssetList } =
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

  console.log(ratedElements);
  const triggerModal = () => {};
  return (
    <AssetSuitabilityEditContext.Provider value={{ triggerModal }}>
      <RatingTable
        ratingValueAccessor={assetRoleWorkTaskSuitabilityRatingAccessor}
        ratingCategoryAccessor={assetRoleWorkTaskSuitabilityLabelAccessor}
        ratedElements={assetDtos}
        labelAccessor={assetNameAccessor}
        ratingListAccessor={assetRoleWorkTaskSuitabilityDtoListAccessor}
        ratingCategories={workTaskTypeDtos}
        triggerModal={triggerModal}
      />
    </AssetSuitabilityEditContext.Provider>
  );
}
