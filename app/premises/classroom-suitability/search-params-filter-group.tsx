'use client';
import { Card } from '@tremor/react';
import { AccessorFunction } from '../../generic/components/tables/rating/rating-table';
import SearchParamsContextProvider from '../../contexts/string-map-context/search-params-context-provider';
import { ApplySearchParams } from './apply-search-params';
import { PropsWithChildren } from 'react';
import { HasNameDto } from '../../api/dtos/HasNameDtoSchema';

export const NameLabelAccessor: AccessorFunction<HasNameDto, string> = (dto) =>
  dto.name;

export default function SearchParamsFilterGroup({
  unsavedContextKey,
  children
}: {
  unsavedContextKey: string;
} & PropsWithChildren) {
  return (
    <Card className={'max-w-[25%]'}>
      <SearchParamsContextProvider>
        <ApplySearchParams unsavedContextKey={unsavedContextKey} />
        {children}
      </SearchParamsContextProvider>
    </Card>
  );
}
