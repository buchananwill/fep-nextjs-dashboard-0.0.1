'use client';
import { DataNode, GraphDto } from '../../../api/zod-mods';
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef
} from 'react';
import { GraphContext } from '../../graph/graph-context-creator';
import { Card } from '@tremor/react';
import CurriculumDeliveryDetails from '../../components/curriculum-delivery-details';
import { NodePayload } from '../../force-graph-page';
import { WorkSeriesBundleDeliveryDto } from '../../../api/dtos/WorkSeriesBundleDeliveryDtoSchema';
import { useGenericLinkContext } from '../../links/generic-link-context-creator';
import { useGenericNodeContext } from '../../nodes/generic-node-context-creator';
import { useSelectiveContextControllerBoolean } from '../../../components/selective-context/selective-context-manager-boolean';
import { useBundleAssignmentsContext } from '../../../curriculum/delivery-models/contexts/use-bundle-assignments-context';
import { OrganizationDto } from '../../../api/dtos/OrganizationDtoSchema';
import { useSelectiveContextKeyMemo } from '../../../components/selective-context/use-selective-context-listener';
import { useModal } from '../../../components/confirm-action-modal';
import {
  deleteLinks,
  deleteNodes,
  putOrganizationGraph
} from '../../../api/actions/curriculum-delivery-model';
import { useRouter } from 'next/navigation';
import { useGraphEditButtonHooks } from '../../editing/use-graph-edit-button-hooks';
import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { TransientIdOffset } from '../../editing/graph-edits';
import { cloneOrganizationNode } from './clone-organization-node';
import { mapToPartyIdBundleIdRecords } from './map-to-party-id-bundle-id-records';
import { mapLinksBackToIdRefs } from '../../links/map-links-back-to-id-refs';
import { NodeLinkRefWrapper } from '../../graph/node-link-ref-wrapper';
import { useForceAdjustments } from '../../graph/show-force-adjustments';
import { useNodeEditing } from '../../show-node-editing';
import NodeDetails from '../../components/node-details';
import { useNodeCloneFunction } from '../../editing/use-node-clone-function';

export const UnsavedNodeDataContextKey = 'unsaved-node-data';
export const NodePositionsKey = 'node-positions-key';

export interface GraphTypeProps<T extends HasNumberIdDto> {
  graphData: GraphDto<T>;
}

function removeTransientId(id: number) {
  return id < TransientIdOffset;
}

const cloneFunction = { function: cloneOrganizationNode };

const CurriculumDeliveryGraphPageKey = 'curriculum-graph-page';

function useUnsavedGraphChangesController() {
  const { uniqueGraphName } = useContext(GraphContext);
  const unsavedGraphContextKey = useSelectiveContextKeyMemo(
    UnsavedNodeDataContextKey,
    uniqueGraphName
  );

  const { currentState: unsavedGraphChanges, dispatchUpdate: setUnsaved } =
    useSelectiveContextControllerBoolean(
      unsavedGraphContextKey,
      unsavedGraphContextKey,
      false
    );
  return { unsavedGraphContextKey, unsavedGraphChanges, setUnsaved };
}

export function useNodeAndLinkRefs<T extends HasNumberIdDto>() {
  const { nodes } = useGenericNodeContext<T>();
  const { links } = useGenericLinkContext<T>();
  const nodesRef = useRef(nodes);
  const linksRef = useRef(links);

  useEffect(() => {
    nodesRef.current = nodes;
    linksRef.current = links;
  }, [nodes, links]);
  return { nodes, nodesRef, linksRef };
}

export default function CurriculumDeliveryGraph({
  bundles
}: PropsWithChildren & { bundles: WorkSeriesBundleDeliveryDto[] }) {
  useForceAdjustments(true);

  useNodeEditing(true);

  useNodeCloneFunction(cloneFunction);
  const { nodes, nodesRef, linksRef } = useNodeAndLinkRefs<OrganizationDto>();

  const appRouterInstance = useRouter();

  const { deletedLinkIds, deletedNodeIds } = useGraphEditButtonHooks(
    CurriculumDeliveryGraphPageKey
  );
  const { unsavedGraphContextKey, unsavedGraphChanges, setUnsaved } =
    useUnsavedGraphChangesController();

  const { isOpen, closeModal, openModal } = useModal();

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

  const handleSaveGraph = () => {
    const nodes = nodesRef.current;
    const links = linksRef.current;
    if (links && nodes) {
      console.log('on their way to the database', nodes);
      const linksWithNumberIdRefs = links.map(mapLinksBackToIdRefs);
      const updatedGraph: GraphDto<OrganizationDto> = {
        nodes: nodes,
        closureDtos: linksWithNumberIdRefs
      };
      const deletedLinkNonTransientIds =
        deletedLinkIds.filter(removeTransientId);
      const deletedNodeNonTransientIds =
        deletedNodeIds.filter(removeTransientId);
      if (deletedNodeNonTransientIds.length > 0) {
        deleteNodes(deletedNodeNonTransientIds);
      }
      if (deletedLinkNonTransientIds.length > 0) {
        deleteLinks(deletedLinkNonTransientIds);
      }
      const unsavedNodes = nodes.filter((n) => !removeTransientId(n.id));
      const unsavedLinks = links.filter((l) => !removeTransientId(l.id));
      console.log('unsaved links: ', unsavedLinks);
      if (unsavedLinks.length > 0 || unsavedNodes.length > 0) {
        putOrganizationGraph(updatedGraph).then((r) => {
          console.log(r);
          if (r.status == 200) {
          }
        });
      }
      setUnsaved({ contextKey: unsavedGraphContextKey, value: false });
      appRouterInstance.refresh();
      closeModal();
    }
  };

  return (
    <NodeLinkRefWrapper
      nodeListRef={nodesRef}
      linkListRef={linksRef}
      textList={descriptionList}
      titleList={titleList}
      unsavedNodeChangesProps={{
        show: isOpen,
        unsavedChanges: unsavedGraphChanges,
        onCancel: closeModal,
        onClose: closeModal,
        handleOpen: openModal,
        onConfirm: handleSaveGraph
      }}
    >
      {' '}
      <NodeDetails nodeDetailElements={nodeDetailElements} labels={classList} />
    </NodeLinkRefWrapper>
  );
}
