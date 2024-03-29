import { ReactNode } from 'react';
import ServiceCategoryContextProvider from '../../work-types/lessons/service-category-context-provider';
import { ObjectPlaceholder } from '../../selective-context/components/typed/selective-context-manager-function';
import WorkTaskFilteringContext from '../../work-types/work-task-filtering-context';
import SearchParamsFilterGroup from '../../premises/classroom-suitability/search-params-filter-group';
import { UnsavedProviderRoleChanges } from '../contexts/providerRoles/provider-role-string-map-context-creator';
import { KnowledgeDomainFilterSelector } from '../../premises/classroom-suitability/knowledge-domain-filter-selector';
import { KnowledgeLevelFilterSelector } from '../../premises/classroom-suitability/knowledge-level-filter-selector';

export default async function TeachersLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <ServiceCategoryContextProvider serviceCategories={ObjectPlaceholder}>
      <WorkTaskFilteringContext>
        {children}

        <SearchParamsFilterGroup unsavedContextKey={UnsavedProviderRoleChanges}>
          <KnowledgeDomainFilterSelector />
          <KnowledgeLevelFilterSelector />
        </SearchParamsFilterGroup>
      </WorkTaskFilteringContext>
    </ServiceCategoryContextProvider>
  );
}
