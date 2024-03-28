'use client';
import { StringMapContextFilterSelector } from './string-map-context-filter-selector';
import { AssetStringMapContext } from '../asset-string-map-context-creator';
import { IdStringFromNumberAccessor } from './rating-table-accessor-functions';
import { NameLabelAccessor } from './search-params-filter-group';

export function AssetRootIdFilterSelector() {
  return (
    <StringMapContextFilterSelector
      context={AssetStringMapContext}
      idAccessor={IdStringFromNumberAccessor}
      labelAccessor={NameLabelAccessor}
      labelDescriptor={'Premises Root'}
      idSearchParamKey={'rootId'}
    />
  );
}
