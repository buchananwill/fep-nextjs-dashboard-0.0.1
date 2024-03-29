'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useAssetStringMapContext } from '../asset-string-map-context-creator';
import { AssetDto } from '../../api/dtos/AssetDtoSchema';
import { AssetSelectionListContextKey } from './asset-suitability-table-wrapper';
import { AssetSuitabilityEditContext } from '../../generic/components/tables/rating/rating-edit-context';
import {
  useAssetSuitabilityListController,
  useAssetSuitabilityListListener
} from '../../contexts/selective-context/asset-suitability-list-selective-context-provider';
import { RatingList } from '../../generic/components/tables/rating/rating-list';
import DisclosureListPanel, {
  ButtonClusterTransformer,
  DisclosureLabelTransformer,
  PanelTransformer,
  TransformerProps
} from '../../generic/components/disclosure-list/disclosure-list-panel';
import ListItemSelector from '../../generic/components/disclosure-list/list-item-selector';
import { useAssetSuitabilityStringMapContext } from '../asset-suitability-context-creator';
import { IdStringFromNumberAccessor } from './rating-table-accessor-functions';
import { useSyncStringMapToProps } from '../../contexts/string-map-context/use-sync-string-map-to-props';
import { useSelectiveContextListenerStringList } from '../../selective-context/components/typed/selective-context-manager-string-list';
import { useSelectiveContextDispatchNumberList } from '../../selective-context/components/typed/selective-context-manager-number-list';
import { useSearchParams } from 'next/navigation';
import { isNotNull, isNotUndefined } from '../../api/main';

export function AssetDisclosureListPanel() {
  const { assetDtoStringMap } = useAssetStringMapContext();

  const { assetDtoList } = useMemo(() => {
    const assetDtoList = Object.values(assetDtoStringMap).sort((a1, a2) =>
      a1.name.localeCompare(a2.name)
    );
    const idList = assetDtoList.map((asset) => asset.id);
    return { assetDtoList, idList };
  }, [assetDtoStringMap]);

  return (
    <DisclosureListPanel
      panelTransformer={AssetPanelTransformer}
      disclosureLabelTransformer={AssetLabelTransformer}
      buttonCluster={AssetButtonClusterTransformer}
      data={assetDtoList}
    />
  );
}

const AssetPanelTransformer: PanelTransformer<AssetDto> = ({
  data
}: TransformerProps<AssetDto>) => {
  const { id } = data;
  const { assetSuitabilityStringMap } = useAssetSuitabilityStringMapContext();

  const { currentState: suitabilityList } = useAssetSuitabilityListListener({
    contextKey: `${id}`,
    listenerKey: 'classroom-panel',
    initialValue: assetSuitabilityStringMap[IdStringFromNumberAccessor(data)]
  });

  return <RatingList data={data} ratingList={suitabilityList} />;
};

const AssetLabelTransformer: DisclosureLabelTransformer<AssetDto> = ({
  data
}: TransformerProps<AssetDto>) => {
  const { assetSuitabilityStringMap } = useAssetSuitabilityStringMapContext();
  const assetSuitabilityStringMapElement =
    assetSuitabilityStringMap[IdStringFromNumberAccessor(data)];
  const stringMapFromContext = useRef(assetSuitabilityStringMapElement);

  const contextKey = useMemo(() => `${data.id}`, [data]);
  const { dispatchUpdate } = useAssetSuitabilityListController({
    contextKey: contextKey,
    listenerKey: 'classroom-label',
    initialValue: assetSuitabilityStringMapElement
  });

  useEffect(() => {
    if (stringMapFromContext.current !== assetSuitabilityStringMapElement) {
      dispatchUpdate({ contextKey, value: assetSuitabilityStringMapElement });
      stringMapFromContext.current = assetSuitabilityStringMapElement;
    }
  }, [
    stringMapFromContext,
    dispatchUpdate,
    assetSuitabilityStringMapElement,
    contextKey
  ]);

  return <>{data.name}</>;
};

const AssetButtonClusterTransformer: ButtonClusterTransformer<AssetDto> = ({
  data
}: TransformerProps<AssetDto>) => {
  return (
    <ListItemSelector
      itemDescriptor={'Classroom'}
      itemListKey={AssetSelectionListContextKey}
      selectorListenerKey={`asset-selection:${data.id}`}
      itemId={data.id}
    />
  );
};
