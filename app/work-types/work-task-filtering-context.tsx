import { PropsWithChildren } from 'react';
import KnowledgeDomainContextProvider from './lessons/knowledge-domain-context-provider';
import KnowledgeLevelContextProvider from './lessons/knowledge-level-context-provider';
import {
  getAllKnowledgeDomains,
  getAllKnowledgeLevels
} from '../api/actions/service-categories';
import { ObjectPlaceholder } from '../selective-context/components/typed/selective-context-manager-function';
import { convertListToStringMap } from '../contexts/string-map-context/convert-list-to-string-map';
import { IdStringFromNumberAccessor } from '../premises/classroom-suitability/rating-table-accessor-functions';
import { EmptyArray } from '../api/main';
import { KnowledgeLevelDto } from '../api/dtos/KnowledgeLevelDtoSchema';
import { KnowledgeDomainDto } from '../api/dtos/KnowledgeDomainDtoSchema';

export default async function WorkTaskFilteringContext({
  children
}: PropsWithChildren) {
  const { data: levels } = await getAllKnowledgeLevels();
  const { data: domains } = await getAllKnowledgeDomains();

  const levelsMap = convertListToStringMap<KnowledgeLevelDto>(
    levels || EmptyArray,
    IdStringFromNumberAccessor
  );
  const domainsMap = convertListToStringMap<KnowledgeDomainDto>(
    domains || EmptyArray,
    IdStringFromNumberAccessor
  );

  return (
    <KnowledgeDomainContextProvider knowledgeDomains={domainsMap}>
      <KnowledgeLevelContextProvider knowledgeLevels={levelsMap}>
        {children}
      </KnowledgeLevelContextProvider>
    </KnowledgeDomainContextProvider>
  );
}
