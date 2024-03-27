import { ActionResponsePromise } from '../../../api/actions/actionResponse';
import { GraphDto } from '../../../api/zod-mods';
import { WorkTaskTypeDto } from '../../../api/dtos/WorkTaskTypeDtoSchema';
import { getWorkTaskTypeGraph } from '../../../api/actions/work-task-types';
import LessonTypeGraphPage from '../lesson-type-graph-page';
import {
  getAllKnowledgeDomains,
  getAllKnowledgeLevels
} from '../../../api/actions/service-categories';
import { DataNotFoundCard } from '../../../timetables/students/[schedule]/page';
import ServiceCategoryContextInit from '../service-category-context-init';
import { EmptyArray } from '../../../api/main';

export const dynamic = 'force-dynamic';

export default async function LessonTypesPage({
  params: { typeNameLike }
}: {
  params: { typeNameLike: string };
  searchParams: { typeNameLike: string };
}) {
  const paramOrFallBack =
    typeNameLike === 'All' || undefined ? '' : typeNameLike;
  const lessonTypesResponseGraph: ActionResponsePromise<
    GraphDto<WorkTaskTypeDto>
  > = getWorkTaskTypeGraph(paramOrFallBack);

  const { data: kLevels } = await getAllKnowledgeLevels();

  const { data: kDomains } = await getAllKnowledgeDomains();

  if (kLevels === undefined || kDomains === undefined) {
    return <DataNotFoundCard>Category data missing.</DataNotFoundCard>;
  }

  const yearGroupOptions = kLevels.map((kl) => `Year ${kl.levelOrdinal}`);
  const subjectOptions = kDomains.map((kd) => kd.name);
  const allOptions = ['All', ...yearGroupOptions, ...subjectOptions];

  return (
    <ServiceCategoryContextInit
      knowledgeLevels={kLevels}
      knowledgeDomains={kDomains}
      serviceCategories={EmptyArray}
    >
      <LessonTypeGraphPage
        lessonTypesResponseGraph={lessonTypesResponseGraph}
        currentSelection={typeNameLike}
        selectionOptions={allOptions}
      />
    </ServiceCategoryContextInit>
  );
}
