'use client';
import { StringMapContextFilterSelector } from './string-map-context-filter-selector';
import { NameLabelAccessor } from './search-params-filter-group';
import { AccessorFunction } from '../../generic/components/tables/rating/rating-table';
import { KnowledgeLevelDto } from '../../api/dtos/KnowledgeLevelDtoSchema';
import { EntityNamesMap } from '../../api/entity-names-map';

export const LevelOrdinalAccessor: AccessorFunction<
  KnowledgeLevelDto,
  string
> = (dto) => dto.levelOrdinal.toString();

export function KnowledgeLevelFilterSelector() {
  return (
    <StringMapContextFilterSelector<KnowledgeLevelDto>
      entityName={EntityNamesMap.knowledgeLevel}
      labelAccessor={NameLabelAccessor}
      idAccessor={LevelOrdinalAccessor}
      labelDescriptor={'Year'}
      idSearchParamKey={'knowledgeLevelOrdinal'}
    />
  );
}
