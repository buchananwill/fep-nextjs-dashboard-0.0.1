import { Title, Card } from '@tremor/react';
import { ActionResponsePromise } from '../../../api/actions/actionResponse';
import { GraphDto } from '../../../api/zod-mods';
import { WorkTaskTypeDto } from '../../../api/dtos/WorkTaskTypeDtoSchema';
import { getWorkTaskTypeGraph } from '../../../api/actions/work-task-types';
import ForceGraphPage from '../../../graphing/force-graph-page';
import { LessonTypeHierarchyGraph } from '../lesson-type-hierarchy-graph';
import DropdownParam from '../../../components/dropdown/dropdown-param';
import LessonTypeGraphPage from '../lesson-type-graph-page';
import { getKnowledgeLevels } from '../../../api/actions/service-categories';
import { DataNotFoundCard } from '../../../timetables/students/[schedule]/page';

export const dynamic = 'force-dynamic';
const paramsMock = ['Maths', 'Year 13', 'all'];
export default async function LessonTypesPage({
  params: { typeNameLike }
}: {
  params: { typeNameLike: string };
  searchParams: { typeNameLike: string };
}) {
  const paramOrFallBack =
    typeNameLike === 'all' || undefined ? 'teaching' : typeNameLike;
  const lessonTypesResponseGraph: ActionResponsePromise<
    GraphDto<WorkTaskTypeDto>
  > = getWorkTaskTypeGraph(paramOrFallBack);

  const { data } = await getKnowledgeLevels(2);
  if (data === undefined) {
    return <DataNotFoundCard>No year groups found.</DataNotFoundCard>;
  }

  const yearGroupOptions = data.map((kl) => `Year ${kl.levelOrdinal}`);

  return (
    <LessonTypeGraphPage
      lessonTypesResponseGraph={lessonTypesResponseGraph}
      currentSelection={typeNameLike}
      selectionOptions={yearGroupOptions}
    />
  );
}
