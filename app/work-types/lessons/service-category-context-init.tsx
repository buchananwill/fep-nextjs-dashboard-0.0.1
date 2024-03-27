'use client';

import { useEditingContextDependency } from '../../curriculum/delivery-models/use-editing-context-dependency';
import { useServiceCategoryContext } from './use-service-category-context';
import { PropsWithChildren } from 'react';
import { ServiceCategoryDto } from '../../api/dtos/ServiceCategoryDtoSchema';
import { KnowledgeLevelDto } from '../../api/dtos/KnowledgeLevelDtoSchema';
import { KnowledgeDomainDto } from '../../api/dtos/KnowledgeDomainDtoSchema';
import { EmptyArray } from '../../api/main';
export default function ServiceCategoryContextInit({
  serviceCategories,
  knowledgeLevels = EmptyArray,
  knowledgeDomains = EmptyArray,
  children
}: {
  serviceCategories: ServiceCategoryDto[];
  knowledgeLevels?: KnowledgeLevelDto[];
  knowledgeDomains?: KnowledgeDomainDto[];
} & PropsWithChildren) {
  const { dispatchCategories, dispatchDomains, dispatchLevels } =
    useServiceCategoryContext();

  useEditingContextDependency(
    serviceCategories,
    dispatchCategories,
    (category) => category.id.toString()
  );
  useEditingContextDependency(knowledgeDomains, dispatchDomains, (domain) =>
    domain.id.toString()
  );
  useEditingContextDependency(knowledgeLevels, dispatchLevels, (level) =>
    level.id.toString()
  );

  return <>{children}</>;
}
