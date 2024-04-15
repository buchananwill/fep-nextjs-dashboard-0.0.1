'use client';
import { StringMapContextFilterSelector } from './string-map-context-filter-selector';
import { IdStringFromNumberAccessor } from './rating-table-accessor-functions';
import { NameLabelAccessor } from './search-params-filter-group';
import { EntityNamesMap } from '../../api/entity-names-map';
import { KnowledgeDomainDto } from '../../api/dtos/KnowledgeDomainDtoSchema';

export function KnowledgeDomainFilterSelector() {
  return (
    <StringMapContextFilterSelector<KnowledgeDomainDto>
      entityName={EntityNamesMap.knowledgeDomain}
      labelAccessor={NameLabelAccessor}
      idAccessor={IdStringFromNumberAccessor}
      labelDescriptor={'Subject'}
      idSearchParamKey={'knowledgeDomain'}
    />
  );
}
