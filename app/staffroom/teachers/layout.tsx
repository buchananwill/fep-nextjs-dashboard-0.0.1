import { Card } from '@tremor/react';
import { ReactNode } from 'react';
import ServiceCategoryContextProvider from '../../work-types/lessons/service-category-context-provider';
import {
  getAllKnowledgeDomains,
  getAllKnowledgeLevels
} from '../../api/actions/service-categories';
import { ObjectPlaceholder } from '../../generic/components/selective-context/selective-context-manager-function';
import KnowledgeDomainContextProvider from '../../work-types/lessons/knowledge-domain-context-provider';
import KnowledgeLevelContextProvider from '../../work-types/lessons/knowledge-level-context-provider';
import WorkTaskFilteringContext from '../../work-types/work-task-filtering-context';

export default async function TeachersLayout({
  children
}: {
  children: ReactNode;
}) {
  const { data: kLevels } = await getAllKnowledgeLevels();

  const { data: kDomains } = await getAllKnowledgeDomains();

  return (
    <ServiceCategoryContextProvider serviceCategories={ObjectPlaceholder}>
      <KnowledgeDomainContextProvider
        knowledgeDomains={kDomains || ObjectPlaceholder}
      >
        <KnowledgeLevelContextProvider
          knowledgeLevels={kLevels || ObjectPlaceholder}
        >
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
        </KnowledgeLevelContextProvider>
      </KnowledgeDomainContextProvider>
    </ServiceCategoryContextProvider>
  );
}
