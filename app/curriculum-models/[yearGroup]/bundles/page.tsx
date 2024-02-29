import {
  getBundles,
  getCurriculumDeliveryModelSchemas
} from '../../../api/actions/curriculum-delivery-model';
import { normalizeQueryParamToNumber } from '../../../api/utils';
import { Card } from '@tremor/react';
import BoxHierarchies from '../../../playground/box-hierarchies';
import ForceGraphPage from '../../../graphing/force-graph-page';
import { BundleEditor } from './bundle-editor';
import { CurriculumDeliveryModels } from './curriculum-delivery-models';

export default async function Page({
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

  const schemasIdsAndNames = data.content.reduce(
    (prev, curr, currentIndex) => {
      return { ...prev, [curr.id]: curr.name };
    },
    {} as { [key: string]: string }
  );

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
      <BundleEditor
        bundleLeanDtos={bundleLeanDtos}
        schemaOptions={schemasIdsAndNames}
      />

      <CurriculumDeliveryModels workProjectSeriesSchemaDtos={content} />
      <ForceGraphPage></ForceGraphPage>
    </>
  );
}
