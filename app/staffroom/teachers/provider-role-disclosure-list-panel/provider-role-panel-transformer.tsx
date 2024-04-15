import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';
import { useWorkTaskCompetencyListListener } from '../../../contexts/selective-context/work-task-competency-list-selective-context-provider';
import { EmptyArray } from '../../../api/main';
import { RatingList } from '../../../generic/components/tables/rating/rating-list';
import React from 'react';
import { ProviderRoleTypeWorkTaskTypeSuitabilityDto } from '../../../api/dtos/ProviderRoleTypeWorkTaskTypeSuitabilityDtoSchema';

export function ProviderRolePanelTransformer(props: { data: ProviderRoleDto }) {
  const { data } = props;
  const { id } = data;
  const { currentState } = useWorkTaskCompetencyListListener({
    contextKey: `${id}`,
    listenerKey: `provider-role-label`,
    initialValue: EmptyArray as ProviderRoleTypeWorkTaskTypeSuitabilityDto[]
  });

  return <RatingList data={data} ratingList={currentState} />;
}
