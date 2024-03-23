'use client';
import RatingTable from '../rating-table';
import { useContext } from 'react';
import { ProviderContext } from '../../contexts/providerRoles/provider-context';
import { ProviderRoleSelectionContext } from '../../contexts/providerRoles/provider-role-selection-context';
import { SkillEditContext } from '../../contexts/providerRoles/rating-edit-context';
import {
  providerRoleNameAccessor,
  workTaskCompetencyDtoListAccessor,
  workTaskCompetencyLabelAccessor,
  workTaskCompetencyRatingAccessor
} from './rating-table-accessor-functions';

export default function SkillsPage({}: {}) {
  const { providers, workTaskTypes } = useContext(ProviderContext);
  const { selectedProviders } = useContext(ProviderRoleSelectionContext);

  const { triggerModal } = useContext(SkillEditContext);
  const firstProvider = providers[0];

  if (!firstProvider) {
    return (
      <div className={'w-full h-fit bg-gray-400 text-black rounded-lg p-2'}>
        No teachers.
      </div>
    );
  }

  const filteredProviderRoles = providers.filter((providerRole) =>
    selectedProviders.some((id) => providerRole.id == id.id)
  );
  return (
    <RatingTable
      ratingValueAccessor={workTaskCompetencyRatingAccessor}
      ratingCategoryAccessor={workTaskCompetencyLabelAccessor}
      ratedElements={filteredProviderRoles}
      labelAccessor={providerRoleNameAccessor}
      ratingListAccessor={workTaskCompetencyDtoListAccessor}
      ratingCategories={workTaskTypes}
      triggerModal={triggerModal}
    />
  );
}
