'use client';
import { PropsWithChildren, useReducer } from 'react';
import {
  KnowledgeDomainContext,
  KnowledgeDomainContextDispatch,
  KnowledgeLevelContext,
  KnowledgeLevelContextDispatch,
  ServiceCategoryContext,
  ServiceCategoryContextDispatch
} from './use-service-category-context';
import {
  StringMap,
  StringMapReducer
} from '../../curriculum/delivery-models/contexts/string-map-context-creator';
import { ServiceCategoryDto } from '../../api/dtos/ServiceCategoryDtoSchema';
import { KnowledgeDomainDto } from '../../api/dtos/KnowledgeDomainDtoSchema';
import { KnowledgeLevelDto } from '../../api/dtos/KnowledgeLevelDtoSchema';

export interface ServiceCategoryContextProviderProps extends PropsWithChildren {
  serviceCategories: StringMap<ServiceCategoryDto>;
  knowledgeDomains: StringMap<KnowledgeDomainDto>;
  knowledgeLevels: StringMap<KnowledgeLevelDto>;
}

export default function ServiceCategoryContextProvider({
  children,
  serviceCategories,
  knowledgeLevels,
  knowledgeDomains
}: ServiceCategoryContextProviderProps) {
  const serviceCategoryReducer = StringMapReducer<ServiceCategoryDto>;
  const [serviceCategoryMap, dispatchServiceCategories] = useReducer(
    serviceCategoryReducer,
    serviceCategories
  );
  const knowledgeDomainReducer = StringMapReducer<KnowledgeDomainDto>;
  const [knowledgeDomainMap, dispatchKnowledgeDomains] = useReducer(
    knowledgeDomainReducer,
    knowledgeDomains
  );
  const knowledgeLevelReducer = StringMapReducer<KnowledgeLevelDto>;
  const [knowledgeLevelMap, dispatchKnowledgeLevels] = useReducer(
    knowledgeLevelReducer,
    knowledgeLevels
  );

  return (
    <ServiceCategoryContext.Provider value={serviceCategoryMap}>
      <ServiceCategoryContextDispatch.Provider
        value={dispatchServiceCategories}
      >
        <KnowledgeDomainContext.Provider value={knowledgeDomainMap}>
          <KnowledgeDomainContextDispatch.Provider
            value={dispatchKnowledgeDomains}
          >
            <KnowledgeLevelContext.Provider value={knowledgeLevelMap}>
              <KnowledgeLevelContextDispatch.Provider
                value={dispatchKnowledgeLevels}
              >
                {children}
              </KnowledgeLevelContextDispatch.Provider>
            </KnowledgeLevelContext.Provider>
          </KnowledgeDomainContextDispatch.Provider>
        </KnowledgeDomainContext.Provider>
      </ServiceCategoryContextDispatch.Provider>
    </ServiceCategoryContext.Provider>
  );
}
