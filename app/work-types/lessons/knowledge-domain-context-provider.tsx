'use client';
import { PropsWithChildren } from 'react';
import { StringMap } from '../../contexts/string-map-context/string-map-reducer';
import { StringMapContextProvider } from '../../contexts/string-map-context/string-map-context-provider';
import { IdStringFromNumberAccessor } from '../../premises/classroom-suitability/rating-table-accessor-functions';
import {
  KnowledgeDomainContext,
  KnowledgeDomainContextDispatch
} from './use-service-category-context';
import { KnowledgeDomainDto } from '../../api/dtos/KnowledgeDomainDtoSchema';

export interface KnowledgeDomainContextProviderProps extends PropsWithChildren {
  knowledgeDomains: StringMap<KnowledgeDomainDto>;
}

const Provider = StringMapContextProvider<KnowledgeDomainDto>;

export default function KnowledgeDomainContextProvider({
  children,
  knowledgeDomains
}: KnowledgeDomainContextProviderProps) {
  return (
    <Provider
      initialEntityMap={knowledgeDomains}
      mapKeyAccessor={IdStringFromNumberAccessor}
      mapContext={KnowledgeDomainContext}
      dispatchContext={KnowledgeDomainContextDispatch}
    >
      {children}
    </Provider>
  );
}
