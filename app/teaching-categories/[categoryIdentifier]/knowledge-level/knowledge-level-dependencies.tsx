'use client';

import { deleteKnowledgeLevel } from '../../../api/actions/service-categories';
import { useRouter } from 'next/navigation';
import { KnowledgeLevelDto } from '../../../api/dtos/KnowledgeLevelDtoSchema';
import { TwoStageClick } from '../../../generic/components/buttons/two-stage-click';

export function KnowledgeLevelDependencies({ kl }: { kl: KnowledgeLevelDto }) {
  const appRouterInstance = useRouter();
  const { workTaskTypeCount, serviceCategoryId, id } = kl;
  return workTaskTypeCount > 0 ? (
    <TwoStageClick
      onClick={() =>
        console.log('Number of tasks associated:', workTaskTypeCount)
      }
      standardAppearance={'light'}
      primedAppearance={'primary'}
      primedMessage={'Go to dependencies?'}
    >
      {workTaskTypeCount}
    </TwoStageClick>
  ) : (
    <TwoStageClick
      onClick={() => {
        deleteKnowledgeLevel(kl).then(() => appRouterInstance.refresh());
      }}
      standardAppearance={'light'}
    >
      {workTaskTypeCount}
    </TwoStageClick>
  );
}
