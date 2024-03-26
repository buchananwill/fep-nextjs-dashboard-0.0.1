'use client';
import React, { useMemo } from 'react';
import { useProviderRoleStringMapContext } from '../../contexts/providerRoles/provider-role-string-map-context-creator';
import DisclosureListPanel from '../../../generic/components/disclosure-list/disclosure-list-panel';
import { ProviderRoleLabel } from './provider-role-label';
import { ProviderRoleButtonCluster } from './provider-role-button-cluster';
import { ProviderRolePanelTransformer } from './provider-role-panel-transformer';

export default function ProviderRoleDisclosureList() {
  const { providerRoleDtoStringMap } = useProviderRoleStringMapContext();

  const providers = useMemo(() => {
    return Object.values(providerRoleDtoStringMap).sort((a1, a2) =>
      a1.name.localeCompare(a2.name)
    );
  }, [providerRoleDtoStringMap]);

  return (
    <>
      {providerRoleDtoStringMap && (
        <DisclosureListPanel
          data={providers}
          buttonCluster={ProviderRoleButtonCluster}
          disclosureLabelTransformer={ProviderRoleLabel}
          panelTransformer={ProviderRolePanelTransformer}
        />
      )}
    </>
  );
}
