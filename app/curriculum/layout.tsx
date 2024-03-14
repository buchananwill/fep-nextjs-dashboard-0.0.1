import { ReactNode } from 'react';
import { CurriculumModelsContextProvider } from './delivery-models/contexts/curriculum-models-context-provider';
import { WorkTaskTypeContextProvider } from './delivery-models/contexts/work-task-type-context-provider';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <WorkTaskTypeContextProvider models={{}}>
      <CurriculumModelsContextProvider models={{}}>
        {children}
      </CurriculumModelsContextProvider>
    </WorkTaskTypeContextProvider>
  );
}