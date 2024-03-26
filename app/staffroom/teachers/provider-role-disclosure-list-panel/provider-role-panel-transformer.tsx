import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';
import { useWorkTaskCompetencyListListener } from '../../../contexts/selective-context/work-task-competency-list-selective-context-provider';
import { EmptyArray } from '../../../api/main';
import { WorkTaskCompetencyDto } from '../../../api/dtos/WorkTaskCompetencyDtoSchema';
import { RatingList } from '../rating-list';
import { SkillEditContext } from '../../../generic/components/modals/rating-edit-context';
import React from 'react';

export function ProviderRolePanelTransformer(props: { data: ProviderRoleDto }) {
  const { data } = props;
  const { id } = data;
  const { currentState } = useWorkTaskCompetencyListListener({
    contextKey: `${id}`,
    listenerKey: `provider-role-label`,
    initialValue: EmptyArray as WorkTaskCompetencyDto[]
  });

  return (
    <RatingList
      data={data}
      context={SkillEditContext}
      ratingList={currentState}
    />
  );
}
