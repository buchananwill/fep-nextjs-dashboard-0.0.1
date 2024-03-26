'use client';
import { useMemo } from 'react';
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

export function AssetDisclosureListPanel() {
  const { assetDtoStringMap } = useAssetStringMapContext();

  const assetDtoList = useMemo(() => {
    return Object.values(assetDtoStringMap).sort((a1, a2) =>
      a1.name.localeCompare(a2.name)
    );
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
  const { id, assetRoleWorkTaskSuitabilities } = data;
  const { currentState: suitabilityList } = useAssetSuitabilityListListener({
    contextKey: `${id}`,
    listenerKey: 'classroom-panel',
    initialValue: assetRoleWorkTaskSuitabilities
  });

  return (
    <RatingList
      data={data}
      ratingList={suitabilityList}
      context={AssetSuitabilityEditContext}
    />
  );
};

const AssetLabelTransformer: DisclosureLabelTransformer<AssetDto> = ({
  data
}: TransformerProps<AssetDto>) => {
  const {} = useAssetSuitabilityListController({
    contextKey: `${data.id}`,
    listenerKey: 'classroom-label',
    initialValue: data.assetRoleWorkTaskSuitabilities
  });

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
