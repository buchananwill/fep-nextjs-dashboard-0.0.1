import { Card, Title } from '@tremor/react';
import { ServiceCategoryEditor } from './serviceCategoryEditor';
import KnowledgeDomainTableEditor from './knowledge-domain/knowledge-domain-table-editor';
import KnowledgeLevelTableEditor from './knowledge-level/knowledge-level-table-editor';
import { DataNotFoundCard } from '../../timetables/students/[schedule]/data-not-found-card';
import { getDtoListByExampleList } from '../../api/READ-ONLY-generated-actions/ServiceCategory';
import { parseTen } from '../../api/date-and-time';

export default async function ServiceCategoriesPage({
  params: { categoryIdentifier }
}: {
  params: { categoryIdentifier: string };
}) {
  const { data } = await getDtoListByExampleList([
    { id: parseTen(categoryIdentifier) },
    { name: categoryIdentifier }
  ]);

  if (data === undefined || data.length < 1) {
    return (
      <DataNotFoundCard>Could not find: {categoryIdentifier}</DataNotFoundCard>
    );
  }

  const serCat = data[0];

  return (
    <Card className={'flex flex-col'}>
      <Title>{serCat.name}</Title>
      <div className={'h-[70vh]'}>
        <ServiceCategoryEditor
          metaData={serCat}
          knowledgeDomainPanel={
            <KnowledgeDomainTableEditor
              category={serCat}
            ></KnowledgeDomainTableEditor>
          }
          knowledgeLevelPanel={
            <KnowledgeLevelTableEditor
              category={serCat}
            ></KnowledgeLevelTableEditor>
          }
        ></ServiceCategoryEditor>
      </div>
    </Card>
  );
}
