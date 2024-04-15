import { ReactNode } from 'react';
import SearchParamsFilterGroup from '../../premises/classroom-suitability/search-params-filter-group';
import { UnsavedProviderRoleChanges } from '../contexts/providerRoles/provider-role-string-map-context-creator';
import { KnowledgeDomainFilterSelector } from '../../premises/classroom-suitability/knowledge-domain-filter-selector';
import { KnowledgeLevelFilterSelector } from '../../premises/classroom-suitability/knowledge-level-filter-selector';
import { SECONDARY_EDUCATION_CATEGORY_ID } from '../../api/main';
import ServiceCategoryProvider from '../../generic/providers/service-category-provider';

export default async function TeachersLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ServiceCategoryProvider
        serviceCategoryId={SECONDARY_EDUCATION_CATEGORY_ID}
      />

      {children}

      <SearchParamsFilterGroup unsavedContextKey={UnsavedProviderRoleChanges}>
        <KnowledgeDomainFilterSelector />
        <KnowledgeLevelFilterSelector />
      </SearchParamsFilterGroup>
    </>
  );
}
