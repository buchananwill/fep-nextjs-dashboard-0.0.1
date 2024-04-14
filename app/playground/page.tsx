import { Card } from '@nextui-org/card';
import { isNotUndefined } from '../api/main';
import { DataNotFoundCard } from '../timetables/students/[schedule]/data-not-found-card';
import {
  getAll,
  putList
} from '../api/READ-ONLY-generated-actions/WorkTaskType';
import DtoControllerArray from '../selective-context/components/controllers/dto-controller-array';
import ClientComponentExample from './client-component-example';

export default async function PlaygroundPage({}: {}) {
  const { data: assetList } = await getAll();

  if (!isNotUndefined(assetList))
    return <DataNotFoundCard>No matrix.</DataNotFoundCard>;

  const sortedList = assetList.sort((type1, type2) =>
    type1.name.localeCompare(type2.name)
  );

  return (
    <>
      {
        <DtoControllerArray
          dtoList={sortedList}
          entityName={'workTaskType'}
          updateServerAction={putList}
        />
      }
      <Card className={'grid grid-cols-2 gap-2 py-2'}>
        <ClientComponentExample />
      </Card>
    </>
  );
}
