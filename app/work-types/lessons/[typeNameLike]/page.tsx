import { ActionResponsePromise } from '../../../api/actions/actionResponse';
import { GraphDto } from '../../../api/zod-mods';
import { WorkTaskTypeDto } from '../../../api/dtos/WorkTaskTypeDtoSchema';
import LessonTypeGraphPage from '../lesson-type-graph-page';
import { SECONDARY_EDUCATION_CATEGORY_ID } from '../../../api/main';
import { DataNotFoundCard } from '../../../timetables/students/[schedule]/data-not-found-card';
import { getGraph } from '../../../api/READ-ONLY-generated-actions/WorkTaskType';
import { getDtoListByExampleList } from '../../../api/READ-ONLY-generated-actions/KnowledgeDomain';
import { getAll } from '../../../api/READ-ONLY-generated-actions/KnowledgeLevel';
import { getAll as getAllKnowledgeDomains } from '../../../api/READ-ONLY-generated-actions/KnowledgeDomain';
import DtoControllerArray from '../../../selective-context/components/controllers/dto-controller-array';

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

  const { data: kLevels } = await getAll();

  const { data: kDomains } = await getAllKnowledgeDomains();

  if (kLevels === undefined || kDomains === undefined) {
    return <DataNotFoundCard>Category data missing.</DataNotFoundCard>;
  }

  const yearGroupOptions = kLevels.map((kl) => `Year ${kl.levelOrdinal}`);
  const subjectOptions = kDomains.map((kd) => kd.name);
  const allOptions = ['All', ...yearGroupOptions, ...subjectOptions];

  return (
    <>
      <DtoControllerArray dtoList={kLevels} entityName={'knowledgeLevel'} />
      <DtoControllerArray dtoList={kDomains} entityName={'knowledgeDomain'} />
      <LessonTypeGraphPage
        lessonTypesResponseGraph={lessonTypesResponseGraph}
        currentSelection={typeNameLike}
        selectionOptions={allOptions}
      />
    </>
  );
}
