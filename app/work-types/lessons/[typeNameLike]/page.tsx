import { ActionResponsePromise } from '../../../api/actions/actionResponse';
import { GraphDto } from '../../../api/zod-mods';
import { WorkTaskTypeDto } from '../../../api/dtos/WorkTaskTypeDtoSchema';
import LessonTypeGraphPage from '../lesson-type-graph-page';
import {
  getAllKnowledgeDomains,
  getAllKnowledgeLevels
} from '../../../api/actions/custom/service-categories';
import ServiceCategoryContextInit from '../service-category-context-init';
import { EmptyArray } from '../../../api/main';
import { DataNotFoundCard } from '../../../timetables/students/[schedule]/data-not-found-card';
import { getGraph } from '../../../api/READ-ONLY-generated-actions/WorkTaskType';

export const dynamic = 'force-dynamic';

export default async function LessonTypesPage({
  params: { typeNameLike }
}: {
  params: { typeNameLike: string };
  searchParams: { typeNameLike: string };
}) {
  const lessonTypesResponseGraph: ActionResponsePromise<
    GraphDto<WorkTaskTypeDto>
  > = getGraph();

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
