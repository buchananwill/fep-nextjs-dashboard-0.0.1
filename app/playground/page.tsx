import { Badge, Card, Grid } from '@tremor/react';
import { getCurriculumDeliveryModelSchemas } from '../api/actions/curriculum-delivery-model';
import { CurriculumDeliveryModel } from './curriculum-delivery-model';

export default async function PlaygroundPage() {
  const curriculumDeliveryModelSchemas =
    await getCurriculumDeliveryModelSchemas();

  const { status, data, message } = curriculumDeliveryModelSchemas;

  if (status >= 400) {
    return <Card>{message}</Card>;
  } else if (data === undefined || data.length === 0) {
    return <Card>{message}</Card>;
  } else
    return (
      <Grid numItemsSm={1} numItemsLg={2} className="gap-6">
        {data.map((item) => (
          <CurriculumDeliveryModel key={item.id} model={item} />
        ))}
      </Grid>
    );
}
