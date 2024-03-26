import { ReactNode, Suspense } from 'react';
import { CurriculumModelsContextProvider } from '../curriculum/delivery-models/contexts/curriculum-models-context-provider';
import Loading from '../loading';
import ServiceCategoryContextProvider from './lessons/service-category-context-provider';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ServiceCategoryContextProvider
      knowledgeDomains={{}}
      knowledgeLevels={{}}
      serviceCategories={{}}
    >
      <CurriculumModelsContextProvider models={{}}>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </CurriculumModelsContextProvider>
    </ServiceCategoryContextProvider>
  );
}
