import { PropsWithChildren } from 'react';
import KnowledgeDomainContextProvider from './lessons/knowledge-domain-context-provider';
import KnowledgeLevelContextProvider from './lessons/knowledge-level-context-provider';
import {
  getAllKnowledgeDomains,
  getAllKnowledgeLevels
} from '../api/actions/service-categories';
import { ObjectPlaceholder } from '../generic/components/selective-context/selective-context-manager-function';

export default async function WorkTaskFilteringContext({
  children
}: PropsWithChildren) {
  const { data: levels } = await getAllKnowledgeLevels();
  const { data: domains } = await getAllKnowledgeDomains();

  return (
    <KnowledgeDomainContextProvider
      knowledgeDomains={domains || ObjectPlaceholder}
    >
      <KnowledgeLevelContextProvider
        knowledgeLevels={levels || ObjectPlaceholder}
      >
        {children}
      </KnowledgeLevelContextProvider>
    </KnowledgeDomainContextProvider>
  );
}
