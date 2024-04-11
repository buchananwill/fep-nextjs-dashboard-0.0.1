'use client';
import { KnowledgeDomainDto } from '../../../api/dtos/KnowledgeDomainDtoSchema';

import { deleteKnowledgeDomain } from '../../../api/actions/custom/service-categories';
import { useRouter } from 'next/navigation';
import { TwoStageClick } from '../../../generic/components/buttons/two-stage-click';

export function KnowledgeDomainDependencies({
  kd
}: {
  kd: KnowledgeDomainDto;
}) {
  const appRouterInstance = useRouter();
  const { workTaskTypeCount } = kd;
  return workTaskTypeCount > 0 ? (
    <TwoStageClick
      onClick={() =>
        console.log(
          '(Not implemented) Number of tasks associated:',
          workTaskTypeCount
        )
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
        deleteKnowledgeDomain(kd).then(() => appRouterInstance.refresh());
      }}
      standardAppearance={'light'}
    >
      {workTaskTypeCount}
    </TwoStageClick>
  );
}
