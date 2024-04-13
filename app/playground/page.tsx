import { Card } from '@nextui-org/card';
import { isNotUndefined } from '../api/main';
import { DataNotFoundCard } from '../timetables/students/[schedule]/data-not-found-card';
import { getAll } from '../api/READ-ONLY-generated-actions/WorkTaskType';
import DtoControllerArray from '../selective-context/components/controllers/dto-controller-array';
import ClientComponentExample from './client-component-example';

export default async function PlaygroundPage({}: {}) {
  const { data: assetList } = await getAll();

  if (!isNotUndefined(assetList))
    return <DataNotFoundCard>No matrix.</DataNotFoundCard>;

  return (
    <>
      {<DtoControllerArray dtoArray={assetList} entityName={'workTaskType'} />}
      <Card className={'flex gap-4'}>
        <ClientComponentExample />
      </Card>
    </>
  );
}
