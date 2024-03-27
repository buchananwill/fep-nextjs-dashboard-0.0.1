import { createContext, useContext } from 'react';
import {
  StringMap,
  StringMapDispatch
} from '../../contexts/string-map-context/string-map-reducer';
import { KnowledgeDomainDto } from '../../api/dtos/KnowledgeDomainDtoSchema';
import { KnowledgeLevelDto } from '../../api/dtos/KnowledgeLevelDtoSchema';
import { ServiceCategoryDto } from '../../api/dtos/ServiceCategoryDtoSchema';
import { createStringMapContext } from '../../contexts/string-map-context/context-creator';

export function useServiceCategoryContext() {
  const categoryMap = useContext(ServiceCategoryContext);
  const dispatchCategories = useContext(ServiceCategoryContextDispatch);
  const domainMap = useContext(KnowledgeDomainContext);
  const dispatchDomains = useContext(KnowledgeDomainContextDispatch);
  const levelMap = useContext(KnowledgeLevelContext);
  const dispatchLevels = useContext(KnowledgeLevelContextDispatch);
  return {
    categoryMap,
    dispatchCategories,
    domainMap,
    dispatchDomains,
    levelMap,
    dispatchLevels
  };
}

export const {
  mapContext: ServiceCategoryContext,
  dispatchContext: ServiceCategoryContextDispatch
} = createStringMapContext<ServiceCategoryDto>();
export const {
  mapContext: KnowledgeDomainContext,
  dispatchContext: KnowledgeDomainContextDispatch
} = createStringMapContext<KnowledgeDomainDto>();
export const {
  mapContext: KnowledgeLevelContext,
  dispatchContext: KnowledgeLevelContextDispatch
} = createStringMapContext<KnowledgeLevelDto>();
