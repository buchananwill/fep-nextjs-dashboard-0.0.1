'use client';
import { StringMapContextFilterSelector } from './string-map-context-filter-selector';
import { KnowledgeLevelContext } from '../../work-types/lessons/use-service-category-context';
import { NameLabelAccessor } from './search-params-filter-group';
import { AccessorFunction } from '../../generic/components/tables/rating/rating-table';
import { KnowledgeLevelDto } from '../../api/dtos/KnowledgeLevelDtoSchema';

export const LevelOrdinalAccessor: AccessorFunction<
  KnowledgeLevelDto,
  string
> = (dto) => dto.levelOrdinal.toString();

export function KnowledgeLevelFilterSelector() {
  return (
    <StringMapContextFilterSelector
      context={KnowledgeLevelContext}
      labelAccessor={NameLabelAccessor}
      idAccessor={LevelOrdinalAccessor}
      labelDescriptor={'Year'}
      idSearchParamKey={'knowledgeLevelOrdinal'}
    />
  );
}
