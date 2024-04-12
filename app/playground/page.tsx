import { Card } from '@nextui-org/card';
import SelectiveContextManagerGlobal from '../selective-context/components/global/selective-context-manager-global';
import { isNotUndefined } from '../api/main';
import { DataNotFoundCard } from '../timetables/students/[schedule]/data-not-found-card';
import { getAll } from '../api/READ-ONLY-generated-actions/WorkTaskType';
import DtoControllerArray from '../selective-context/components/controllers/dto-controller-array';
import SomeComponentInterestedInADto from './some-component-interested-in-a-dto';

export default async function PlaygroundPage({}: {}) {
  const { data: assetList } = await getAll();

  if (!isNotUndefined(assetList))
    return <DataNotFoundCard>No matrix.</DataNotFoundCard>;

  return (
    <SelectiveContextManagerGlobal>
      {<DtoControllerArray dtoArray={assetList} entityName={'workTaskType'} />}
      <Card className={'flex gap-4'}>
        {assetList.map((workTaskType) => (
          <SomeComponentInterestedInADto
            entityName={'workTaskType'}
            id={workTaskType.id}
            key={`asset:${workTaskType.id}`}
          />
        ))}
      </Card>
    </SelectiveContextManagerGlobal>
  );
}
