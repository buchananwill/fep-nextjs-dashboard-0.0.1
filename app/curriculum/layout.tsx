import { ReactNode, Suspense } from 'react';
import { CurriculumModelsContextProvider } from './delivery-models/contexts/curriculum-models-context-provider';
import { WorkTaskTypeContextProvider } from './delivery-models/contexts/work-task-type-context-provider';
import Loading from '../loading';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <WorkTaskTypeContextProvider models={{}}>
      <CurriculumModelsContextProvider models={{}}>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </CurriculumModelsContextProvider>
    </WorkTaskTypeContextProvider>
  );
}
