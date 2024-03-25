'use client';
import { AssetSuitabilityEditContext } from '../../staffroom/contexts/providerRoles/rating-edit-context';
import RatingTable from '../../staffroom/teachers/rating-table';
import {
  assetNameAccessor,
  assetRoleWorkTaskSuitabilityDtoListAccessor,
  assetRoleWorkTaskSuitabilityIdAccessor,
  assetRoleWorkTaskSuitabilityLabelAccessor,
  assetRoleWorkTaskSuitabilityRatingValueAccessor
} from './rating-table-accessor-functions';
import { useWorkTaskTypeContext } from '../../curriculum/delivery-models/contexts/use-work-task-type-context';
import { AssetDto } from '../../api/dtos/AssetDtoSchema';
import { useSelectiveContextControllerNumberList } from '../../components/selective-context/selective-context-manager-number-list';
import { StringMap } from '../../curriculum/delivery-models/contexts/string-map-context-creator';
import { useContext, useMemo } from 'react';
import { useAssetStringMapContext } from '../asset-string-map-context-creator';
import { useRatingEditModal } from '../../staffroom/contexts/providerRoles/use-rating-edit-modal';
import { RatingEditModal } from '../../staffroom/contexts/providerRoles/rating-edit-modal';
import { Card } from '@tremor/react';
import { isNotNull } from '../../api/main';
import { useAssetSuitabilityListDispatch } from '../../components/selective-context/typed/asset-suitability-list-selective-context-provider';
import { RatingTableRatings } from '../../staffroom/teachers/rating-table-ratings';
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
          {assetDtos.map((ratedElement) => (
            <tr key={ratedElement.id} className="">
              <th
                className="text-sm px-2 sticky left-0 bg-opacity-100 z-10 bg-white"
                scope={'row'}
              >
                {ratedElement.name}
              </th>
              <RatingTableRatings
                ratedElement={ratedElement}
                ratingEditContext={AssetSuitabilityEditContext}
              />
            </tr>
          ))}
        </RatingTable>
      </div>
    </Card>
  );
}
