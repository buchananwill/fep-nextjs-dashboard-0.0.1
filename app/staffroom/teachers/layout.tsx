import { Card } from '@tremor/react';
import { ReactNode } from 'react';
import ServiceCategoryContextProvider from '../../work-types/lessons/service-category-context-provider';
import {
  getAllKnowledgeDomains,
  getAllKnowledgeLevels
} from '../../api/actions/service-categories';
import ServiceCategoryContextInit, {
  ServiceCategoriesEmptyArray
} from '../../work-types/lessons/service-category-context-init';
import RatingTable from './rating-table';
import { RatingTableBody } from '../../premises/classroom-suitability/rating-table-body';
import {
  assetRoleWorkTaskSuitabilityDtoListAccessor,
  AssetSuitabilityAccessorFunctions,
  IdStringFromNumberAccessor
} from '../../premises/classroom-suitability/rating-table-accessor-functions';
import { AssetSuitabilityEditContext } from '../contexts/providerRoles/rating-edit-context';

export default async function TeachersLayout({
  children
}: {
  children: ReactNode;
}) {
  const { data: kLevels } = await getAllKnowledgeLevels();

  const { data: kDomains } = await getAllKnowledgeDomains();

  return (
    <ServiceCategoryContextProvider
      knowledgeDomains={{}}
      knowledgeLevels={{}}
      serviceCategories={{}}
    >
      <ServiceCategoryContextInit
        serviceCategories={ServiceCategoriesEmptyArray}
        knowledgeLevels={kLevels}
        knowledgeDomains={kDomains}
      />
      <div className={'flex w-full'}>
        <Card className={'max-w-[75%] max-h-[75vh] p-0'}>
          <div
            className={
              'max-w-full max-h-full overflow-auto box-border border-8 border-transparent'
            }
          >
            {children}
          </div>
        </Card>
      </div>
    </ServiceCategoryContextProvider>
  );
}
