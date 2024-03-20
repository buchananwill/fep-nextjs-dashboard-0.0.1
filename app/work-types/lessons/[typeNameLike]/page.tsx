import { ActionResponsePromise } from '../../../api/actions/actionResponse';
import { GraphDto } from '../../../api/zod-mods';
import { WorkTaskTypeDto } from '../../../api/dtos/WorkTaskTypeDtoSchema';
import { getWorkTaskTypeGraph } from '../../../api/actions/work-task-types';
import LessonTypeGraphPage from '../lesson-type-graph-page';
import {
  getKnowledgeDomains,
  getKnowledgeLevels
} from '../../../api/actions/service-categories';
import { DataNotFoundCard } from '../../../timetables/students/[schedule]/page';
import { SECONDARY_EDUCATION_CATEGORY_ID } from '../../../api/main';

export const dynamic = 'force-dynamic';
const paramsMock = ['Maths', 'Year 13', 'all'];
export default async function LessonTypesPage({
  params: { typeNameLike }
}: {
  params: { typeNameLike: string };
  searchParams: { typeNameLike: string };
}) {
  const paramOrFallBack =
    typeNameLike === 'All' || undefined ? 'teaching' : typeNameLike;
  const lessonTypesResponseGraph: ActionResponsePromise<
    GraphDto<WorkTaskTypeDto>
  > = getWorkTaskTypeGraph(paramOrFallBack);

  const { data: kLevels } = await getKnowledgeLevels(
    SECONDARY_EDUCATION_CATEGORY_ID.toString()
  );

  const { data: kDomains } = await getKnowledgeDomains(
    SECONDARY_EDUCATION_CATEGORY_ID.toString()
  );

  if (kLevels === undefined || kDomains === undefined) {
    return <DataNotFoundCard>Category data missing.</DataNotFoundCard>;
  }

  const yearGroupOptions = kLevels.map((kl) => `Year ${kl.levelOrdinal}`);
  const subjectOptions = kDomains.map((kd) => kd.name);
  const allOptions = ['All', ...yearGroupOptions, ...subjectOptions];

  return (
    <LessonTypeGraphPage
      lessonTypesResponseGraph={lessonTypesResponseGraph}
      currentSelection={typeNameLike}
      selectionOptions={allOptions}
    />
  );
}
