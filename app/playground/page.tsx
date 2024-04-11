import { Card } from '@nextui-org/card';
import SelectiveContextManagerGlobal from '../selective-context/components/global/selective-context-manager-global';
import { isNotUndefined } from '../api/main';
import { DataNotFoundCard } from '../timetables/students/[schedule]/data-not-found-card';
import { getPage } from '../api/READ-ONLY-generated-actions/Carousel';

export default async function PlaygroundPage({}: {}) {
  const actionResponse = await getPage({});

  const data = undefined;

  if (!isNotUndefined(data))
    return <DataNotFoundCard>No matrix.</DataNotFoundCard>;

  return (
    <SelectiveContextManagerGlobal>
      <Card className={'flex gap-4'}></Card>
    </SelectiveContextManagerGlobal>
  );
}
