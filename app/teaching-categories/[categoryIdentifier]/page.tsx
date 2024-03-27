import { Card, Title } from '@tremor/react';
import { getServiceCategoryByIdentifier } from '../../api/actions/service-categories';
import { ServiceCategoryEditor } from './serviceCategoryEditor';
import KnowledgeDomainTableEditor from './knowledge-domain/knowledge-domain-table-editor';
import KnowledgeLevelTableEditor from './knowledge-level/knowledge-level-table-editor';
import { DataNotFoundCard } from '../../timetables/students/[schedule]/data-not-found-card';

export default async function ServiceCategoriesPage({
  params: { categoryIdentifier }
}: {
  params: { categoryIdentifier: string };
}) {
  const { data } = await getServiceCategoryByIdentifier(categoryIdentifier);

  if (data === undefined) {
    return (
      <DataNotFoundCard>Could not find: {categoryIdentifier}</DataNotFoundCard>
    );
  }

  return (
    <Card className={'flex flex-col'}>
      <Title>{data.name}</Title>
      <div className={'h-[70vh]'}>
        <ServiceCategoryEditor
          metaData={data}
          knowledgeDomainPanel={
            <KnowledgeDomainTableEditor
              category={data}
            ></KnowledgeDomainTableEditor>
          }
          knowledgeLevelPanel={
            <KnowledgeLevelTableEditor
              category={data}
            ></KnowledgeLevelTableEditor>
          }
        ></ServiceCategoryEditor>
      </div>
    </Card>
  );
}
