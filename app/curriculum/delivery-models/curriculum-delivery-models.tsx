'use client';
import { WorkProjectSeriesSchemaDto } from '../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { Grid } from '@tremor/react';
import { CurriculumDeliveryModel } from './curriculum-delivery-model';
import React, { useEffect, useMemo } from 'react';
import { AddNewCurriculumModelCard } from './add-new-curriculum-model-card';
import { useCurriculumModelContext } from './contexts/use-curriculum-model-context';
import { useSelectiveContextListenerBoolean } from '../../generic/components/selective-context/selective-context-manager-boolean';
import {
  DeletedCurriculumModelIdsKey,
  EmptyIdArray,
  UnsavedCurriculumModelChanges
} from './contexts/curriculum-models-context-provider';
import { useEditingContextDependency } from './use-editing-context-dependency';
import { UuidAccessor } from './use-curriculum-delivery-model-and-work-task-dependency';
import { useSearchParams } from 'next/navigation';
import { useSelectiveContextDispatchStringList } from '../../generic/components/selective-context/selective-context-manager-string-list';
import { CurriculumModelNameListValidator } from './[yearGroup]/curriculum-model-name-list-validator';

export const curriculumDeliveryCommitKey = 'commit-model-changes-open';

const modelsListenerKey = 'models-component';

export function CurriculumDeliveryModels({
  yearGroup,
  modelsPayload
}: {
  yearGroup: number;
  modelsPayload: WorkProjectSeriesSchemaDto[];
}) {
  const { curriculumModelsMap, dispatch } = useCurriculumModelContext();

  const { currentState: deletedIds, dispatchWithoutControl } =
    useSelectiveContextDispatchStringList({
      contextKey: DeletedCurriculumModelIdsKey,
      listenerKey: modelsListenerKey,
      initialValue: EmptyIdArray
    });

  useEditingContextDependency(modelsPayload, dispatch, UuidAccessor);

  const { isTrue: alreadyUnsaved } = useSelectiveContextListenerBoolean(
    UnsavedCurriculumModelChanges,
    modelsListenerKey,
    false
  );

  const modelsInView = useMemo(() => {
    return modelsPayload.map(UuidAccessor);
  }, [modelsPayload]);

  return (
    <CurriculumModelNameListValidator>
      <div className={'w-full my-4'}>
        <Grid numItemsSm={1} numItemsLg={3} className="gap-4">
          <AddNewCurriculumModelCard
            alreadyUnsaved={alreadyUnsaved}
            yearGroup={yearGroup}
          />
          {Object.values(curriculumModelsMap)
            .filter(({ id }) => modelsInView.includes(id))
            .map((item, index) => (
              <CurriculumDeliveryModel key={item.id} model={item} />
            ))}
        </Grid>
      </div>
    </CurriculumModelNameListValidator>
  );
}
