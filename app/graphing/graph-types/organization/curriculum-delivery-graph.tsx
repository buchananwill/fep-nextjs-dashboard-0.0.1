'use client';
import { DataNode } from '../../../api/zod-mods';
import React, { PropsWithChildren } from 'react';
import { Card } from '@nextui-org/card';
import CurriculumDeliveryDetails from './curriculum-delivery-details';
import { NodePayload } from '../../force-graph-page';
import { WorkSeriesBundleAssignmentDto } from '../../../api/dtos/WorkSeriesBundleAssignmentDtoSchema';
import { OrganizationDto } from '../../../api/dtos/OrganizationDtoSchema';
import { cloneOrganizationNode } from './clone-organization-node';
import { NodeLinkRefWrapper } from '../../graph/node-link-ref-wrapper';
import NodeDetails from '../../components/node-details';
import { useNodeEditing } from '../../editing/functions/use-node-editing';
import { useNodeAndLinkRefs } from '../../graph/use-node-and-link-refs';
import { putGraph } from '../../../api/READ-ONLY-generated-actions/Organization';
import { getPayloadArray } from '../../../curriculum/delivery-models/use-editing-context-dependency';
import { isNotUndefined } from '../../../api/main';
import { getGraphUpdaterWithNameDeDuplication } from './get-graph-updater-with-name-de-duplication';
import { useStringMapContextController } from '../work-task-types/use-string-map-context-controller';

export const UnsavedNodeDataContextKey = 'unsaved-node-data';
export const NodePositionsKey = 'node-positions-key';
const cloneFunctionWrapper = { cachedFunction: cloneOrganizationNode };

const organizationGraphUpdater = getGraphUpdaterWithNameDeDuplication(putGraph);

export const CurriculumDeliveryGraphPageKey = 'curriculum-delivery-graph-page';

export default function CurriculumDeliveryGraph({
  bundles
}: PropsWithChildren & { bundles: WorkSeriesBundleAssignmentDto[] }) {
  const { nodes, nodesRef, linksRef } = useNodeAndLinkRefs<OrganizationDto>();

  console.log(bundles);

  useStringMapContextController(
    'workSeriesSchemaBundle',
    CurriculumDeliveryGraphPageKey
  );

  const bundlesInNodeOrder = nodes.map((node) => {
    const found = bundles.find(
      (delivery) => delivery.organizationId === node.id
    );
    if (found) return found;
  });

  const definedBundles = bundlesInNodeOrder.filter(isNotUndefined);

  const initialPayload = getPayloadArray(definedBundles, (assignment) =>
    assignment.organizationId.toString()
  );

  const unsavedGraphChanges = useNodeEditing(
    nodesRef,
    linksRef,
    cloneFunctionWrapper,
    organizationGraphUpdater
  );

  if (bundlesInNodeOrder.length !== nodes.length) {
    return <Card>Bundles not matching nodes!</Card>;
  }

  const classList: string[] = [];
  const descriptionList: string[] = [];

  nodes.forEach((n: DataNode<OrganizationDto>) => {
    classList.push(n.data.name);
    descriptionList.push(n.data.name);
  });

  const titleList = nodes.map(
    (n: DataNode<OrganizationDto>) => n.data?.type?.name || ''
  );

  const nodeDetailElements: NodePayload<OrganizationDto>[] = nodes.map(
    (node) => {
      return {
        node: node
      };
    }
  );

  return (
    <NodeLinkRefWrapper
      nodeListRef={nodesRef}
      linkListRef={linksRef}
      textList={descriptionList}
      titleList={titleList}
      unsavedNodeChangesProps={unsavedGraphChanges}
    >
      {' '}
      <NodeDetails
        nodeDetailElements={nodeDetailElements}
        labels={classList}
        detailsUiComponent={CurriculumDeliveryDetails}
      />
    </NodeLinkRefWrapper>
  );
}
