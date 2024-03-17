'use client';
import { KnowledgeDomainDto } from '../../../api/dtos/KnowledgeDomainDtoSchema';
import { TwoStageClick } from '../../../components/buttons/two-stage-click';
import { deleteKnowledgeDomain } from '../../../api/actions/service-categories';
import { useRouter } from 'next/navigation';

export function KnowledgeDomainDependencies({
  kd
}: {
  kd: KnowledgeDomainDto;
}) {
  const appRouterInstance = useRouter();
  const { workTaskTypeCount, serviceCategoryId, id } = kd;
  return workTaskTypeCount > 0 ? (
    <TwoStageClick
      onClick={() =>
        console.log('Number of tasks associated:', workTaskTypeCount)
      }
      primedAppearance={'btn-primary'}
      primedMessage={'Go to dependencies?'}
    >
      {workTaskTypeCount}
    </TwoStageClick>
  ) : (
    <TwoStageClick
      onClick={() => {
        deleteKnowledgeDomain(kd).then(() => appRouterInstance.refresh());
      }}
    >
      {workTaskTypeCount}
    </TwoStageClick>
  );
}
