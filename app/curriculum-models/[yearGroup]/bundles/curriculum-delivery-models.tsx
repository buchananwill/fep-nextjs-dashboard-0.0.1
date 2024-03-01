'use client';
import { WorkProjectSeriesSchemaDto } from '../../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { Grid } from '@tremor/react';
import { CurriculumDeliveryModel } from '../../curriculum-delivery-model';
import { useContext, useEffect } from 'react';

import { useCurriculumModelContext } from '../../contexts/use-curriculum-model-context';

export function CurriculumDeliveryModels({
  workProjectSeriesSchemaDtos
}: {
  workProjectSeriesSchemaDtos: WorkProjectSeriesSchemaDto[];
}) {
  const { curriculumModelsMap, dispatch } = useCurriculumModelContext();

  useEffect(() => {
    const payloadArray = workProjectSeriesSchemaDtos.map((schema) => ({
      key: schema.id,
      data: schema
    }));
    dispatch({
      type: 'updateAll',
      payload: payloadArray
    });
  }, [workProjectSeriesSchemaDtos, dispatch]);

  return (
    <div className={'w-full my-4'}>
      {/*<Pagination first={first} last={last} pageNumber={number} />*/}
      <Grid numItemsSm={1} numItemsLg={4} className="gap-4">
        {workProjectSeriesSchemaDtos.map((item, index) => (
          <CurriculumDeliveryModel key={item.id} model={item} />
        ))}
      </Grid>
    </div>
  );
}
