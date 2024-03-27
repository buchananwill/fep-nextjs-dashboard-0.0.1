'use client';
import { PropsWithChildren } from 'react';
import { StringMap } from '../../contexts/string-map-context/string-map-reducer';
import { StringMapContextProvider } from '../../contexts/string-map-context/string-map-context-provider';
import { IdStringFromNumberAccessor } from '../../premises/classroom-suitability/rating-table-accessor-functions';

import { KnowledgeLevelDto } from '../../api/dtos/KnowledgeLevelDtoSchema';
import {
  KnowledgeLevelContext,
  KnowledgeLevelContextDispatch
} from './use-service-category-context';

export interface KnowledgeLevelContextProviderProps extends PropsWithChildren {
  knowledgeLevels: StringMap<KnowledgeLevelDto>;
}

const Provider = StringMapContextProvider<KnowledgeLevelDto>;

export default function KnowledgeLevelContextProvider({
  children,
  knowledgeLevels
}: KnowledgeLevelContextProviderProps) {
  return (
    <Provider
      initialEntityMap={knowledgeLevels}
      mapKeyAccessor={IdStringFromNumberAccessor}
      mapContext={KnowledgeLevelContext}
      dispatchContext={KnowledgeLevelContextDispatch}
    >
      {children}
    </Provider>
  );
}
