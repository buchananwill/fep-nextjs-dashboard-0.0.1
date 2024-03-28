'use client';
import { PropsWithChildren } from 'react';
import { StringMapContextProvider } from './string-map-context-provider';
import { ObjectPlaceholder } from '../../generic/components/selective-context/selective-context-manager-function';
import {
  SearchParamsContext,
  SearchParamsDispatchContext
} from './search-params-context-creator';
import { NameIdStringTuple } from '../../api/dtos/NameIdStringTupleSchema';
import { AccessorFunction } from '../../generic/components/tables/rating/rating-table';

const Provider = StringMapContextProvider<NameIdStringTuple>;

const KeyAccessor: AccessorFunction<NameIdStringTuple, string> = (tuple) =>
  tuple.id;
export default function SearchParamsContextProvider({
  children
}: PropsWithChildren) {
  return (
    <Provider
      initialEntityMap={ObjectPlaceholder}
      mapContext={SearchParamsContext}
      dispatchContext={SearchParamsDispatchContext}
      mapKeyAccessor={KeyAccessor}
    >
      {children}
    </Provider>
  );
}
