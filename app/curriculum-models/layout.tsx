import { ReactNode } from 'react';
import { CurriculumModelsContextProvider } from './contexts/curriculum-models-context-provider';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <CurriculumModelsContextProvider models={{}}>
      {children}
    </CurriculumModelsContextProvider>
  );
}
