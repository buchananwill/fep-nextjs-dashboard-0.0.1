import { getCurriculumDeliveryModelSchemas } from '../../api/actions/curriculum-delivery-model';
import { Card, Grid } from '@tremor/react';
import BoxHierarchies from '../../playground/box-hierarchies';
import { CurriculumDeliveryModel } from '../../playground/curriculum-delivery-model';
import ForceGraphPage from '../../playground/force-graph-page';
import { Pagination } from '../../components/pagination';
import { normalizeQueryParamToNumber } from '../../api/utils';

export default async function PlaygroundPage({
  params: { yearGroup },
  searchParams
}: {
  params: {
    yearGroup: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { page, size } = searchParams;
  const curriculumDeliveryModelSchemas =
    await getCurriculumDeliveryModelSchemas(
      parseInt(yearGroup),
      normalizeQueryParamToNumber(page, 0),
      normalizeQueryParamToNumber(size, 8)
    );

  const { status, data, message } = curriculumDeliveryModelSchemas;
  if (data === undefined) {
    return <Card>No schemas found!</Card>;
  }

  const { content, last, first, number, totalPages } = data;

  if (status >= 400) {
    return <Card>{message}</Card>;
  }
  return (
    <>
      <BoxHierarchies></BoxHierarchies>
      <Pagination first={first} last={last} pageNumber={number} />
      <Grid numItemsSm={1} numItemsLg={4} className="gap-4">
        {content.map((item) => (
          <CurriculumDeliveryModel key={item.id} model={item} />
        ))}
      </Grid>
      <ForceGraphPage></ForceGraphPage>
    </>
  );
}
