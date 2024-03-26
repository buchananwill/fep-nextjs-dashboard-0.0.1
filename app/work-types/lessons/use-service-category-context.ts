import { createContext, Dispatch, useContext } from 'react';
import {
  StringMap,
  StringMapDispatch
} from '../../contexts/string-map-context/string-map-reducer';
import { KnowledgeDomainDto } from '../../api/dtos/KnowledgeDomainDtoSchema';
import { KnowledgeLevelDto } from '../../api/dtos/KnowledgeLevelDtoSchema';
import { ServiceCategoryDto } from '../../api/dtos/ServiceCategoryDtoSchema';

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

export const ServiceCategoryContext = createContext<
  StringMap<ServiceCategoryDto>
>({} as StringMap<ServiceCategoryDto>);

export const ServiceCategoryContextDispatch = createContext<
  StringMapDispatch<ServiceCategoryDto>
>(() => {});
export const KnowledgeDomainContext = createContext<
  StringMap<KnowledgeDomainDto>
>({} as StringMap<KnowledgeDomainDto>);

export const KnowledgeDomainContextDispatch = createContext<
  StringMapDispatch<KnowledgeDomainDto>
>(() => {});
export const KnowledgeLevelContext = createContext<
  StringMap<KnowledgeLevelDto>
>({} as StringMap<KnowledgeLevelDto>);

export const KnowledgeLevelContextDispatch = createContext<
  StringMapDispatch<KnowledgeLevelDto>
>(() => {});
