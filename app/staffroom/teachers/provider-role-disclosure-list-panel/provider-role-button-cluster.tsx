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

export function ProviderRoleButtonCluster({ data }: { data: ProviderRoleDto }) {
  const [isPinned, setPinned] = useState(false);

  const { selectedProviders, toggleProviderSelection } = useContext(
    ProviderRoleSelectionContext
  );
  const { current } = useContext(HslColorContext);
  const { id } = data;

  useEffect(() => {
    const selected = selectedProviders.some(
      ({ id: providerRoleId }) => providerRoleId == id
    );
    setPinned(selected);
  }, [setPinned, selectedProviders, id]);

  const handlePinClick = () => {
    toggleProviderSelection({ name: data.partyName, id: data.id });
  };

  return (
    <Tooltip placement={'right'}>
      <TooltipTrigger>
        <div
          className="px-1 flex items-center h-full"
          style={{ borderColor: `${current.cssHSLA}` }}
        >
          <FillableButton
            pinIcon={PinIcons.arrowLeftCircle}
            isPinned={isPinned}
            setPinned={handlePinClick}
            id={`teacher:${id}`}
          />
        </div>
      </TooltipTrigger>

      <StandardTooltipContent>
        Click to show teacher in main area.
      </StandardTooltipContent>
    </Tooltip>
  );
}
