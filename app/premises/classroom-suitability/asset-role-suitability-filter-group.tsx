'use client';
import { Card } from '@tremor/react';
import { StringMapContextFilterSelector } from './string-map-context-filter-selector';
import {
  KnowledgeDomainContext,
  KnowledgeLevelContext
} from '../../work-types/lessons/use-service-category-context';
import { AccessorFunction } from '../../generic/components/tables/rating/rating-table';
import { KnowledgeDomainDto } from '../../api/dtos/KnowledgeDomainDtoSchema';
import { IdStringFromNumberAccessor } from './rating-table-accessor-functions';
import SearchParamsContextProvider from '../../contexts/string-map-context/search-params-context-provider';
import { ApplySearchParams } from './apply-search-params';
import { useContext } from 'react';
import { HasNameDto } from '../../api/dtos/HasNameDtoSchema';
import { KnowledgeLevelDto } from '../../api/dtos/KnowledgeLevelDtoSchema';
import { AssetStringMapContext } from '../asset-string-map-context-creator';

export const NameLabelAccessor: AccessorFunction<HasNameDto, string> = (dto) =>
  dto.name;

export const LevelOrdinalAccessor: AccessorFunction<
  KnowledgeLevelDto,
  string
> = (dto) => dto.levelOrdinal.toString();

export default function AssetRoleSuitabilityFilterGroup() {
  const knowledgeDomainDtoStringMap = useContext(KnowledgeDomainContext);
  console.log(knowledgeDomainDtoStringMap);
  return (
    <Card className={'max-w-[25%]'}>
      <SearchParamsContextProvider>
        <ApplySearchParams />
        <StringMapContextFilterSelector
          context={KnowledgeDomainContext}
          labelAccessor={NameLabelAccessor}
          idAccessor={IdStringFromNumberAccessor}
          labelDescriptor={'Subject'}
          idSearchParamKey={'knowledgeDomain'}
        />
        <StringMapContextFilterSelector
          context={KnowledgeLevelContext}
          labelAccessor={NameLabelAccessor}
          idAccessor={LevelOrdinalAccessor}
          labelDescriptor={'Year'}
          idSearchParamKey={'knowledgeLevelOrdinal'}
        />
        <StringMapContextFilterSelector
          context={AssetStringMapContext}
          idAccessor={IdStringFromNumberAccessor}
          labelAccessor={NameLabelAccessor}
          labelDescriptor={'Premises Root'}
          idSearchParamKey={'rootId'}
        />
      </SearchParamsContextProvider>
    </Card>
  );
}
