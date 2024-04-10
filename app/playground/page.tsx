import { Card } from '@nextui-org/card';
import SelectiveContextManagerGlobal from '../selective-context/components/global/selective-context-manager-global';
import { getCoAppearanceMatrix } from '../api/actions/option-blocks';
import { isNotUndefined } from '../api/main';
import { DataNotFoundCard } from '../timetables/students/[schedule]/data-not-found-card';
import ArcChart from './arcChart';
import { getPage } from '../api/actions/carousel';

export default async function PlaygroundPage({}: {}) {
  const actionResponse = await getPage({});
  console.log(actionResponse);

  const { data } = await getCoAppearanceMatrix(12);
  if (!isNotUndefined(data))
    return <DataNotFoundCard>No matrix.</DataNotFoundCard>;

  return (
    <SelectiveContextManagerGlobal>
      <Card className={'flex gap-4'}>
        <ArcChart data={data} />
      </Card>
    </SelectiveContextManagerGlobal>
  );
}
