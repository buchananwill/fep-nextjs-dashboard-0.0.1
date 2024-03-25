'use client';
import RatingTable from '../rating-table';
import { useContext } from 'react';
import { ProviderContext } from '../../contexts/providerRoles/provider-context';
import { ProviderRoleSelectionContext } from '../../contexts/providerRoles/provider-role-selection-context';
import { SkillEditContext } from '../../contexts/providerRoles/rating-edit-context';
import {
  providerRoleNameAccessor,
  workTaskCompetencyDtoListAccessor,
  workTaskCompetencyIdAccessor,
  workTaskCompetencyLabelAccessor,
  workTaskCompetencyRatingAccessor
} from './rating-table-accessor-functions';

export default function SkillsPage({}: {}) {
  const { providers, workTaskTypes } = useContext(ProviderContext);
  const { selectedProviders } = useContext(ProviderRoleSelectionContext);

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
      ratedElements={filteredProviderRoles}
      ratingCategories={workTaskTypes}
      ratingCategoryDescriptor={'Skill'}
    ></RatingTable>
  );
}
