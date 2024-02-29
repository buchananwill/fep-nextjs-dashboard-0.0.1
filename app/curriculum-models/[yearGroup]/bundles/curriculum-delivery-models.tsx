'use client';
import { WorkProjectSeriesSchemaDto } from '../../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { Grid } from '@tremor/react';
import { CurriculumDeliveryModel } from '../../curriculum-delivery-model';
import { useContext, useEffect } from 'react';
import { useCurriculumModelContext } from '../../contexts/curriculum-models-context-creator';

export function CurriculumDeliveryModels({
  workProjectSeriesSchemaDtos
}: {
  workProjectSeriesSchemaDtos: WorkProjectSeriesSchemaDto[];
}) {
  const { curriculumModelsMap, dispatch } = useCurriculumModelContext();

  useEffect(() => {
    dispatch({
      type: 'updateAll',
      payload: workProjectSeriesSchemaDtos
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
