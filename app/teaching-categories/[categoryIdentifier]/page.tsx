import { Card, Title } from '@tremor/react';
import { getServiceCategoryByIdentifier } from '../../api/actions/service-categories';
import { DataNotFoundCard } from '../../timetables/students/[schedule]/page';
import { ServiceCategoryEditor } from './serviceCategoryEditor';
import KnowledgeDomainTableEditor from './knowledge-domain-table-editor';

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
          knowledgeLevelPanel={data.knowledgeLevelDescriptor}
        ></ServiceCategoryEditor>
      </div>
    </Card>
  );
}