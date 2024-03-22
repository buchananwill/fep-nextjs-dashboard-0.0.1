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
        <Card className={'w-fit max-w-[75%] overflow-visible'}>{children}</Card>
      </div>
    </ServiceCategoryContextProvider>
  );
}
