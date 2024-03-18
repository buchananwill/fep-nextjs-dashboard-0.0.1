'use client';
import {
  DataNode,
  GraphDto,
  GraphDtoPutRequestBody
} from '../../../api/zod-mods';
import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import { Card } from '@tremor/react';
import CurriculumDeliveryDetails from '../../components/curriculum-delivery-details';
import { NodePayload } from '../../force-graph-page';
import { WorkSeriesBundleDeliveryDto } from '../../../api/dtos/WorkSeriesBundleDeliveryDtoSchema';
import { useBundleAssignmentsContext } from '../../../curriculum/delivery-models/contexts/use-bundle-assignments-context';
import { OrganizationDto } from '../../../api/dtos/OrganizationDtoSchema';
import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { cloneOrganizationNode } from './clone-organization-node';
import { mapToPartyIdBundleIdRecords } from './map-to-party-id-bundle-id-records';
import { NodeLinkRefWrapper } from '../../graph/node-link-ref-wrapper';
import NodeDetails from '../../components/node-details';
import { useEnableNodeEditing } from './use-enable-node-editing';
import { useNodeAndLinkRefs } from './use-node-and-link-refs';
import {
  deleteLinks,
  deleteNodes,
  putOrganizationGraph
} from '../../../api/actions/curriculum-delivery-model';
import { deDuplicateNames } from '../../../curriculum/lesson-types/increment-clone-suffix';
import * as _ from 'lodash';
import { HasNameDto } from '../../../api/dtos/HasNameDtoSchema';
import { ActionResponsePromise } from '../../../api/actions/actionResponse';
export const UnsavedNodeDataContextKey = 'unsaved-node-data';
export const NodePositionsKey = 'node-positions-key';

export interface GraphTypeProps<T extends HasNumberIdDto> {
  graphData: GraphDto<T>;
}

const cloneFunctionWrapper = { function: cloneOrganizationNode };

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
}: PropsWithChildren & { bundles: WorkSeriesBundleDeliveryDto[] }) {
  const { nodes, nodesRef, linksRef } = useNodeAndLinkRefs<OrganizationDto>();

  const { bundleAssignmentsMap, dispatch } = useBundleAssignmentsContext();

  const bundlesInNodeOrder = nodes.map((node) => {
    const found = bundles.find((delivery) => delivery.partyId === node.id);
    if (found) return found;
  });

  const { bundleAssignments, initialPayload } = useMemo(() => {
    return mapToPartyIdBundleIdRecords(bundles);
  }, [bundles]);

  useEffect(() => {
    dispatch({ type: 'updateAll', payload: initialPayload });
  }, [initialPayload, dispatch]);

  const unsavedGraphChanges = useEnableNodeEditing(
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
    (n: DataNode<OrganizationDto>) => n.data?.organizationType?.name || ''
  );

  const nodeDetailElements: NodePayload<OrganizationDto>[] = nodes.map(
    (node, index) => {
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

  console.log(nodeDetailElements);

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
