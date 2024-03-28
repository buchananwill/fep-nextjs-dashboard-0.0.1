import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';
import React, { useContext, useEffect, useState } from 'react';
import { ProviderRoleSelectionContext } from '../../contexts/providerRoles/provider-role-selection-context';
import { HslColorContext } from '../../../generic/components/color/color-context';
import {
  Tooltip,
  TooltipTrigger
} from '../../../generic/components/tooltips/tooltip';
import {
  FillableButton,
  PinIcons
} from '../../../generic/components/buttons/fillable-button';
import { StandardTooltipContent } from '../../../generic/components/tooltips/standard-tooltip-content';
import ListItemSelector from '../../../generic/components/disclosure-list/list-item-selector';

export const ProviderRoleSelectionList = 'provider-role-selection-list';

export function ProviderRoleButtonCluster({ data }: { data: ProviderRoleDto }) {
  return (
    <ListItemSelector
      itemDescriptor={'Teacher'}
      itemListKey={ProviderRoleSelectionList}
      selectorListenerKey={`provider-selection:${data.id}`}
      itemId={data.id}
    />
  );
}
