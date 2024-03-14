import { Title, Card } from '@tremor/react';
import { ActionResponsePromise } from '../../api/actions/actionResponse';
import { GraphDto } from '../../api/zod-mods';
import { WorkTaskTypeDto } from '../../api/dtos/WorkTaskTypeDtoSchema';
import {
  getWorkTaskTypeGraph,
  getWorkTaskTypes
} from '../../api/actions/work-task-types';
import ForceGraphPage from '../../graphing/force-graph-page';
import { LessonTypeHierarchyGraph } from './lesson-type-hierarchy-graph';

export const dynamic = 'force-dynamic';

export default async function LessonTypesPage({}: {
  searchParams: { q: string };
}) {
  const lessonTypesResponseGraph: ActionResponsePromise<
    GraphDto<WorkTaskTypeDto>
  > = getWorkTaskTypeGraph();

  const actionResponse = await lessonTypesResponseGraph;

  if (actionResponse.status != 200 || actionResponse.data === undefined) {
    console.log(actionResponse);
    return <Card>No premises!</Card>;
  }

  const { data: graphDto } = actionResponse;

  console.log(graphDto);

  return (
    <>
      <Title>Lesson Types</Title>
      <ForceGraphPage dataGraph={graphDto} graphName={'lesson-types-graph'}>
        <LessonTypeHierarchyGraph />
      </ForceGraphPage>
    </>
  );
}
