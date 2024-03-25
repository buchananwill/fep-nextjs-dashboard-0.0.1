'use client';
import { useContext, useEffect, useMemo } from 'react';
import { ToolCardContext } from '../../components/tool-card/tool-card-context';
import { useAssetStringMapContext } from '../asset-string-map-context-creator';
import DisclosureListPanel, {
  ButtonClusterTransformer,
  DisclosureLabelTransformer,
  PanelTransformer,
  TransformerProps
} from '../../components/disclosure-list/disclosure-list-panel';
import { AssetDto } from '../../api/dtos/AssetDtoSchema';
import ListItemSelector from '../../components/disclosure-list/list-item-selector';
import { AssetSelectionListContextKey } from './asset-suitability-table-wrapper';
import { AssetSuitabilityEditContext } from '../../staffroom/contexts/providerRoles/rating-edit-context';
import {
  useAssetSuitabilityListController,
  useAssetSuitabilityListListener
} from '../../components/selective-context/typed/asset-suitability-list-selective-context-provider';
import { RatingList } from '../../staffroom/teachers/rating-list';

export function ClassroomDisclosureListPanel() {
  const { assetDtoStringMap } = useAssetStringMapContext();

  const assetDtoList = useMemo(() => {
    return Object.values(assetDtoStringMap).sort((a1, a2) =>
      a1.name.localeCompare(a2.name)
    );
  }, [assetDtoStringMap]);

  return (
    <DisclosureListPanel
      panelTransformer={ClassroomPanelTransformer}
      disclosureLabelTransformer={ClassroomLabelTransformer}
      buttonCluster={ButtonClusterTransformer}
      data={assetDtoList}
    />
  );
}

const ClassroomPanelTransformer: PanelTransformer<AssetDto> = ({
  data,
  children,
  className
}: TransformerProps<AssetDto>) => {
  const { name } = data;

  const { currentState: suitabilityList } = useAssetSuitabilityListListener({
    contextKey: `${data.id}`,
    listenerKey: 'classroom-panel',
    initialValue: data.assetRoleWorkTaskSuitabilities
  });

  return (
    <RatingList
      data={data}
      ratingList={suitabilityList}
      context={AssetSuitabilityEditContext}
    />
  );
};

const ClassroomLabelTransformer: DisclosureLabelTransformer<AssetDto> = ({
  data
}: TransformerProps<AssetDto>) => {
  const { currentState: suitabilityList } = useAssetSuitabilityListController({
    contextKey: `${data.id}`,
    listenerKey: 'classroom-label',
    initialValue: data.assetRoleWorkTaskSuitabilities
  });

  return <>{data.name}</>;
};

const ButtonClusterTransformer: ButtonClusterTransformer<AssetDto> = ({
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
