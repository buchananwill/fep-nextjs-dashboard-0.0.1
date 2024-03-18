import { Card, Title } from '@tremor/react';
import ForceGraphPage from '../../graphing/force-graph-page';
import { LessonTypeHierarchyGraph } from './lesson-type-hierarchy-graph';
import { ActionResponsePromise } from '../../api/actions/actionResponse';
import { GraphDto } from '../../api/zod-mods';
import { WorkTaskTypeDto } from '../../api/dtos/WorkTaskTypeDtoSchema';
import DropdownParam from '../../components/dropdown/dropdown-param';

export default async function LessonTypeGraphPage({
  lessonTypesResponseGraph,
  currentSelection,
  selectionOptions
}: {
  lessonTypesResponseGraph: ActionResponsePromise<GraphDto<WorkTaskTypeDto>>;
  currentSelection: string;
  selectionOptions: string[];
}) {
  const actionResponse = await lessonTypesResponseGraph;

  if (actionResponse.status != 200 || actionResponse.data === undefined) {
    console.log(actionResponse);
    return <Card>No premises!</Card>;
  }

  const { data: graphDto } = actionResponse;

  return (
    <>
      <Card className={'mb-4 flex'}>
        <Title>Lesson Types</Title>
        <DropdownParam
          paramOptions={selectionOptions}
          currentSelection={currentSelection}
        />
      </Card>
      <Card className={'p-1'}>
        <ForceGraphPage dataGraph={graphDto} graphName={'lesson-types-graph'}>
          <LessonTypeHierarchyGraph />
        </ForceGraphPage>
      </Card>
    </>
  );
}
