'use client';
import { StringMapContextFilterSelector } from './string-map-context-filter-selector';
import { KnowledgeDomainContext } from '../../work-types/lessons/use-service-category-context';
import { IdStringFromNumberAccessor } from './rating-table-accessor-functions';
import { NameLabelAccessor } from './search-params-filter-group';

export function KnowledgeDomainFilterSelector() {
  return (
    <StringMapContextFilterSelector
      context={KnowledgeDomainContext}
      labelAccessor={NameLabelAccessor}
      idAccessor={IdStringFromNumberAccessor}
      labelDescriptor={'Subject'}
      idSearchParamKey={'knowledgeDomain'}
    />
  );
}
