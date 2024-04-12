import { PropsWithChildren } from 'react';
import KnowledgeDomainContextProvider from './lessons/knowledge-domain-context-provider';
import KnowledgeLevelContextProvider from './lessons/knowledge-level-context-provider';
import { convertListToStringMap } from '../contexts/string-map-context/convert-list-to-string-map';
import { IdStringFromNumberAccessor } from '../premises/classroom-suitability/rating-table-accessor-functions';
import { EmptyArray, SECONDARY_EDUCATION_CATEGORY_ID } from '../api/main';
import { KnowledgeLevelDto } from '../api/dtos/KnowledgeLevelDtoSchema';
import { KnowledgeDomainDto } from '../api/dtos/KnowledgeDomainDtoSchema';
import { getDtoListByExampleList } from '../api/READ-ONLY-generated-actions/KnowledgeDomain';
import { getDtoListByExampleList as getKnowledgeLevelsByExampleList } from '../api/READ-ONLY-generated-actions/KnowledgeLevel';

export default async function WorkTaskFilteringContext({
  children
}: PropsWithChildren) {
  const { data: levels } = await getKnowledgeLevelsByExampleList([
    { serviceCategoryId: SECONDARY_EDUCATION_CATEGORY_ID }
  ]);
  const { data: domains } = await getDtoListByExampleList([
    { serviceCategoryId: SECONDARY_EDUCATION_CATEGORY_ID }
  ]);

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
