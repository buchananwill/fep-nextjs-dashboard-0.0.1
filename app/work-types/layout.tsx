import { ReactNode, Suspense } from 'react';
import { CurriculumModelsContextProvider } from '../curriculum/delivery-models/contexts/curriculum-models-context-provider';
import Loading from '../loading';
import ServiceCategoryContextProvider from './lessons/service-category-context-provider';
import WorkTaskFilteringContext from './work-task-filtering-context';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ServiceCategoryContextProvider serviceCategories={{}}>
      <WorkTaskFilteringContext>
        <CurriculumModelsContextProvider models={{}}>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </CurriculumModelsContextProvider>
      </WorkTaskFilteringContext>
    </ServiceCategoryContextProvider>
  );
}
