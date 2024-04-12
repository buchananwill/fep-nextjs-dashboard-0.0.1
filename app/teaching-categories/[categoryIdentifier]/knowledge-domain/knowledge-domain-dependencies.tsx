'use client';
import { KnowledgeDomainDto } from '../../../api/dtos/KnowledgeDomainDtoSchema';
import { useRouter } from 'next/navigation';
import { TwoStageClick } from '../../../generic/components/buttons/two-stage-click';
import { deleteOne } from '../../../api/READ-ONLY-generated-actions/KnowledgeDomain';

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
        deleteOne(kd.id).then(() => appRouterInstance.refresh());
      }}
      standardAppearance={'light'}
    >
      {workTaskTypeCount}
    </TwoStageClick>
  );
}
