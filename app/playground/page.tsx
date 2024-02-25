import { Card, Grid } from '@tremor/react';
import { getCurriculumDeliveryModelSchemas } from '../api/actions/curriculum-delivery-model';
import { CurriculumDeliveryModel } from './curriculum-delivery-model';
import BoxHierarchies from './box-hierarchies';
import ForceGraphPage from './force-graph-page';
import ForceGraphPageWtt from './force-graph-page-wtt';

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
      <>
        <BoxHierarchies></BoxHierarchies>
        <Grid numItemsSm={1} numItemsLg={2} className="gap-6">
          {data.map((item) => (
            <CurriculumDeliveryModel key={item.id} model={item} />
          ))}
        </Grid>
        <ForceGraphPageWtt></ForceGraphPageWtt>
      </>
    );
}
