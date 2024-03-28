'use client';
import { AssetSuitabilityEditContext } from '../../generic/components/tables/rating/rating-edit-context';
import RatingTable from '../../generic/components/tables/rating/rating-table';
import {
  AssetSuitabilityAccessorFunctions,
  IdStringFromNumberAccessor
} from './rating-table-accessor-functions';
import { useWorkTaskTypeContext } from '../../curriculum/delivery-models/contexts/use-work-task-type-context';
import { useSelectiveContextControllerNumberList } from '../../generic/components/selective-context/selective-context-manager-number-list';
import { useAssetStringMapContext } from '../asset-string-map-context-creator';
import { Card } from '@tremor/react';
import { RatingTableBody } from '../../generic/components/tables/rating/rating-table-body';
import { AssetSuitabilityListSelectiveContext } from '../../contexts/selective-context/selective-context-creators';
import { useMemoizedSelectionFromListAndStringMap } from './use-memoized-selection-from-list-and-string-map';
import { EmptyArray } from '../../api/main';
import { useSelectiveContextRatingListAccessor } from './use-selective-context-rating-list-accessor';

export function AssetSuitabilityTableWrapper() {
  const { workTaskTypeMap } = useWorkTaskTypeContext();
  const { assetDtoStringMap } = useAssetStringMapContext();
  const { currentState: selectedAssetList } =
    useSelectiveContextControllerNumberList({
      contextKey: AssetSelectionListContextKey,
      listenerKey: assetSuitabilityTableWrapperListenerKey,
      initialValue: EmptyArray
    });
  const selectiveContextListAccessor = useSelectiveContextRatingListAccessor(
    AssetSuitabilityListSelectiveContext,
    IdStringFromNumberAccessor
  );

  const assetDtos = useMemoizedSelectionFromListAndStringMap(
    selectedAssetList,
    assetDtoStringMap
  );

  const allWorkTaskTypes = Object.values(workTaskTypeMap).sort((wtt1, wtt2) =>
    wtt1.name.localeCompare(wtt2.name)
  );

  return (
    <Card className={'w-full max-w-[50vw] max-h-[75vh] p-0'}>
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

const assetSuitabilityTableWrapperListenerKey =
  'asset-suitability-table-wrapper';

export const AssetSelectionListContextKey = 'asset-selection-list';
