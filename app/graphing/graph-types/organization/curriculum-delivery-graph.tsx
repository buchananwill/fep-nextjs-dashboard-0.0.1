'use client';
import {
  DataNode,
  GraphDto,
  GraphDtoPutRequestBody
} from '../../../api/zod-mods';
import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import { Card } from '@nextui-org/card';
import CurriculumDeliveryDetails from './curriculum-delivery-details';
import { NodePayload } from '../../force-graph-page';
import { WorkSeriesBundleAssignmentDto } from '../../../api/dtos/WorkSeriesBundleAssignmentDtoSchema';
import { useBundleAssignmentsContext } from '../../../curriculum/delivery-models/contexts/use-bundle-assignments-context';
import { OrganizationDto } from '../../../api/dtos/OrganizationDtoSchema';
import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { cloneOrganizationNode } from './clone-organization-node';
import { mapToPartyIdBundleIdRecords } from '../../../curriculum/delivery-models/functions/map-to-party-id-bundle-id-records';
import { NodeLinkRefWrapper } from '../../graph/node-link-ref-wrapper';
import NodeDetails from '../../components/node-details';
import { useNodeEditing } from '../../editing/functions/use-node-editing';
import { useNodeAndLinkRefs } from '../../graph/use-node-and-link-refs';
import { putOrganizationGraph } from '../../../api/actions/curriculum-delivery-model';
import { deDuplicateNames } from '../../editing/functions/increment-clone-suffix';
import _ from 'lodash';
import { HasNameDto } from '../../../api/dtos/HasNameDtoSchema';
import { ActionResponsePromise } from '../../../api/actions/actionResponse';

export const UnsavedNodeDataContextKey = 'unsaved-node-data';
export const NodePositionsKey = 'node-positions-key';
const cloneFunctionWrapper = { cachedFunction: cloneOrganizationNode };

export function getGraphUpdaterWithNameDeDuplication<
  T extends HasNumberIdDto & HasNameDto
>(
  putUpdatedGraph: (
    request: GraphDtoPutRequestBody<T>
  ) => ActionResponsePromise<GraphDto<T>>
) {
  return (request: GraphDtoPutRequestBody<T>) => {
    const { graphDto } = request;
    const { nodes } = graphDto;
    const organizationDtos = nodes.map((dn) => dn.data);
    const dtosWithNamesDeDuplicated = deDuplicateNames(organizationDtos);
    const nodesWithDataNamesDeDuplicated = nodes.map((dn, index) => {
      const replacementData = dtosWithNamesDeDuplicated[index];
      if (replacementData.id !== dn.id)
        throw Error('Arrays not aligned. Could not clone nodes.');
      const cloneDeep = _.cloneDeep(dn);
      cloneDeep.data = replacementData;
      return cloneDeep;
    });
    const safeGraph: GraphDto<T> = {
      ...graphDto,
      nodes: nodesWithDataNamesDeDuplicated
    };
    const safeRequest = { ...request, graphDto: safeGraph };
    return putUpdatedGraph(safeRequest);
  };
}

const organizationGraphUpdater =
  getGraphUpdaterWithNameDeDuplication(putOrganizationGraph);

export const CurriculumDeliveryGraphPageKey = 'curriculum-delivery-graph-page';

export default function CurriculumDeliveryGraph({
  bundles
}: PropsWithChildren & { bundles: WorkSeriesBundleAssignmentDto[] }) {
  const { nodes, nodesRef, linksRef } = useNodeAndLinkRefs<OrganizationDto>();

  const { dispatch } = useBundleAssignmentsContext();

  const bundlesInNodeOrder = nodes.map((node) => {
    const found = bundles.find((delivery) => delivery.partyId === node.id);
    if (found) return found;
  });

  const { initialPayload } = useMemo(() => {
    return mapToPartyIdBundleIdRecords(bundles);
  }, [bundles]);

  useEffect(() => {
    dispatch({ type: 'updateAll', payload: initialPayload });
  }, [initialPayload, dispatch]);

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
        node: node,
        payload: (
          <CurriculumDeliveryDetails
            key={`delivery-details-${node.data.id}`}
            node={node}
          ></CurriculumDeliveryDetails>
        )
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
      <NodeDetails nodeDetailElements={nodeDetailElements} labels={classList} />
    </NodeLinkRefWrapper>
  );
}
