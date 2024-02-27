import {
  getBundles,
  getCurriculumDeliveryModelSchemas
} from '../../../api/actions/curriculum-delivery-model';
import { normalizeQueryParamToNumber } from '../../../api/utils';
import { Card, Grid } from '@tremor/react';
import BoxHierarchies from '../../../playground/box-hierarchies';
import { CurriculumDeliveryModel } from '../../curriculum-delivery-model';
import ForceGraphPage from '../../../graphing/force-graph-page';
import { BundleEditor } from './bundle-editor';

export default async function BundlesPage({
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
      normalizeQueryParamToNumber(size, 20)
    );

  const { status, data, message } = curriculumDeliveryModelSchemas;
  if (data === undefined) {
    return <Card>No schemas found!</Card>;
  }

  const schemaIdList = data.content.map((schema) => schema.id);

  const actionResponse = await getBundles(schemaIdList);

  if (actionResponse.data === undefined) {
    return <Card>No bundles found!</Card>;
  }

  const { content, last, first, number, totalPages } = data;

  const bundleLeanDtos = actionResponse.data;

  if (status >= 400) {
    return <Card>{message}</Card>;
  }
  return (
    <>
      <BoxHierarchies></BoxHierarchies>
      <BundleEditor bundleLeanDtos={bundleLeanDtos} />

      <div className={'w-60'}>
        {/*<Pagination first={first} last={last} pageNumber={number} />*/}
        <Grid numItemsSm={1} numItemsLg={1} className="gap-4">
          {content.map((item) => (
            <CurriculumDeliveryModel key={item.id} model={item} />
          ))}
        </Grid>
      </div>
      <ForceGraphPage></ForceGraphPage>
    </>
  );
}
