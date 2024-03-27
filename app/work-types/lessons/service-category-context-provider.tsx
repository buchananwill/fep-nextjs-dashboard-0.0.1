'use client';
import { PropsWithChildren } from 'react';
import {
  ServiceCategoryContext,
  ServiceCategoryContextDispatch
} from './use-service-category-context';
import { StringMap } from '../../contexts/string-map-context/string-map-reducer';
import { ServiceCategoryDto } from '../../api/dtos/ServiceCategoryDtoSchema';
import { StringMapContextProvider } from '../../contexts/string-map-context/string-map-context-provider';
import { IdStringFromNumberAccessor } from '../../premises/classroom-suitability/rating-table-accessor-functions';

export interface ServiceCategoryContextProviderProps extends PropsWithChildren {
  serviceCategories: StringMap<ServiceCategoryDto>;
}

const Provider = StringMapContextProvider<ServiceCategoryDto>;

export default function ServiceCategoryContextProvider({
  children,
  serviceCategories
}: ServiceCategoryContextProviderProps) {
  return (
    <Provider
      initialEntityMap={serviceCategories}
      mapKeyAccessor={IdStringFromNumberAccessor}
      mapContext={ServiceCategoryContext}
      dispatchContext={ServiceCategoryContextDispatch}
    >
      {children}
    </Provider>
  );
}
