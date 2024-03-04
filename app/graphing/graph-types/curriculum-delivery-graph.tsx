'use client';
import { DataLink, DataNode, GraphDto } from '../../api/zod-mods';
import { PartyDto } from '../../api/dtos/PartyDtoSchema';
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef
} from 'react';
import { GenericNodeContextProvider } from '../nodes/generic-node-context-provider';
import { GenericLinkContextProvider } from '../links/generic-link-context-provider';
import {
  GraphContext,
  useGraphSelectiveContextDispatch
} from '../graph/graph-context-creator';
import { Card } from '@tremor/react';
import CurriculumDeliveryDetails from '../components/curriculum-delivery-details';
import { NodePayload } from '../force-graph-page';
import { WorkSeriesBundleDeliveryDto } from '../../api/dtos/WorkSeriesBundleDeliveryDtoSchema';
import { GraphViewer } from '../graph/graph-viewer';
import GraphForceAdjuster from '../components/graph-force-adjustment';
import NodeDetails from '../components/node-details';
import { AddNodesButton, CloneFunction } from '../editing/add-nodes-button';
import {
  GenericLinkRefContext,
  useGenericLinkContext
} from '../links/generic-link-context-creator';
import {
  GenericNodeRefContext,
  useGenericNodeContext
} from '../nodes/generic-node-context-creator';
import { useFilteredLinkMemo } from '../aggregate-functions/use-filtered-link-memo';
import { useSelectiveContextControllerBoolean } from '../../components/selective-context/selective-context-manager-boolean';
import AddLinksButton from '../editing/add-links-button';
import { DeleteLinksButton } from '../editing/delete-links-button';
import { DeleteNodesButton } from '../editing/delete-nodes-button';
import { BundleAssignmentsProvider } from '../../curriculum-models/contexts/bundle-assignments-provider';
import {
  StringMap,
  StringMapPayload
} from '../../curriculum-models/contexts/string-map-context-creator';
import { BundleItemsContextProvider } from '../../curriculum-models/contexts/bundle-items-context-provider';
import { WorkSeriesSchemaBundleLeanDto } from '../../api/dtos/WorkSeriesSchemaBundleLeanDtoSchema';
import { useBundleAssignmentsContext } from '../../curriculum-models/contexts/use-bundle-assignments-context';
import { DisclosureThatGrowsOpen } from '../../components/disclosures/disclosure-that-grows-open';
import { OrganizationDto } from '../../api/dtos/OrganizationDtoSchema';
import { useSelectiveContextKeyMemo } from '../../components/selective-context/use-selective-context-listener';
import { UnsavedChangesModal } from '../../components/unsaved-changes-modal';
import { useModal } from '../../components/confirm-action-modal';
import {
  deleteLinks,
  deleteNodes,
  putOrganizationGraph
} from '../../api/actions/curriculum-delivery-model';
import { useRouter } from 'next/navigation';
import {
  useDirectSimRefEditsController,
  useGraphEditButtonHooks
} from '../editing/use-graph-edit-button-hooks';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';
import { TransientIdOffset } from '../editing/graph-edits';

export const UnsavedNodeDataContextKey = 'unsaved-node-data';

export interface GraphTypeProps<T extends HasNumberIdDto> {
  graphData: GraphDto<T>;
}

const nameCharLimit = 255;
export const cloneOrganizationNode: CloneFunction<DataNode<OrganizationDto>> = (
  templateNode
) => {
  const {
    data: { name }
  } = templateNode;
  let cloneName = `${name}${templateNode.data.name.substring(name.length - 1)}`;
  cloneName.length > nameCharLimit
    ? cloneName.substring(cloneName.length - nameCharLimit)
    : cloneName;
  return {
    ...templateNode,
    data: { ...templateNode.data, name: cloneName }
  };
};

export function mapToPartyIdBundleIdRecords(
  bundles: WorkSeriesBundleDeliveryDto[]
) {
  const bundleAssignments = {} as StringMap<string>;
  const initialPayload = [] as StringMapPayload<string>[];
  bundles.forEach((bundleDeliveryDto) => {
    const partyIdString = bundleDeliveryDto.partyId.toString();
    const bundleIdString =
      bundleDeliveryDto.workSeriesSchemaBundle.id.toString();
    bundleAssignments[partyIdString] = bundleIdString;
    initialPayload.push({ key: partyIdString, data: bundleIdString });
  });

  return { bundleAssignments, initialPayload };
}

function mapLinksBackToIdRefs<T extends HasNumberIdDto>(l: DataLink<T>) {
  const objectRefSource = l.source as DataNode<T>;
  const objectRefTarget = l.target as DataNode<T>;
  return { ...l, source: objectRefSource.id, target: objectRefTarget.id };
}

function removeTransientId(id: number) {
  return id < TransientIdOffset;
}

export default function CurriculumDeliveryGraph({
  children,
  bundles
}: GraphTypeProps<OrganizationDto> &
  PropsWithChildren & { bundles: WorkSeriesBundleDeliveryDto[] }) {
  const { nodes } = useGenericNodeContext<OrganizationDto>();
  const { links } = useGenericLinkContext<OrganizationDto>();
  const nodesRef = useRef(nodes);
  const linksRef = useRef(links);
  const { uniqueGraphName } = useContext(GraphContext);
  const mountedKey = useMemo(
    () => `${uniqueGraphName}-mounted`,
    [uniqueGraphName]
  );
  const appRouterInstance = useRouter();
  const { currentState, dispatchUpdate } = useSelectiveContextControllerBoolean(
    mountedKey,
    mountedKey,
    true
  );

  const { deletedLinkIds, deletedNodeIds } = useGraphEditButtonHooks(
    'curriculum-delivery-graph-page'
  );

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

  const { isOpen, closeModal, openModal } = useModal();

  const { bundleAssignmentsMap, dispatch } = useBundleAssignmentsContext();

  useEffect(() => {
    dispatchUpdate({ contextKey: mountedKey, value: true });
    return () => {
      dispatchUpdate({ contextKey: mountedKey, value: false });
    };
  }, [dispatchUpdate, mountedKey]);

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

      dispatchUpdate({ contextKey: unsavedGraphContextKey, value: false });
      appRouterInstance.refresh();
      closeModal();
    }
  };

  return (
    <GenericNodeRefContext.Provider value={nodesRef}>
      <GenericLinkRefContext.Provider value={linksRef}>
        <div className={'flex-col'}>
          <GraphViewer
            textList={descriptionList}
            titleList={titleList}
            uniqueGraphName={'party-dto-graph'}
          >
            <div
              className={'sticky -top-0 w-full flex flex-col bg-slate-50 z-10 '}
            >
              <div className={'h-2'}></div>
              <DisclosureThatGrowsOpen
                label={'Edit Nodes'}
                heightWhenOpen={'h-[6.5rem]'}
              >
                <div className={'w-full grid grid-cols-3 gap-1 relative mb-1'}>
                  <AddNodesButton
                    relation={'sibling'}
                    cloneFunction={cloneOrganizationNode}
                  >
                    Add Sibling
                  </AddNodesButton>
                  <AddNodesButton
                    relation={'child'}
                    cloneFunction={cloneOrganizationNode}
                  >
                    Add Child
                  </AddNodesButton>
                  <AddLinksButton>Join Nodes</AddLinksButton>
                </div>
                <div className={'w-full grid grid-cols-2 gap-1 relative'}>
                  <DeleteNodesButton>Delete Nodes</DeleteNodesButton>
                  <DeleteLinksButton>Delete Links</DeleteLinksButton>
                </div>
              </DisclosureThatGrowsOpen>
              <div className={'h-2  border-t'}></div>
            </div>
            <GraphForceAdjuster />
            <NodeDetails
              nodeDetailElements={nodeDetailElements}
              labels={classList}
            />
          </GraphViewer>
        </div>
        <UnsavedChangesModal
          unsavedChanges={unsavedGraphChanges}
          handleOpen={openModal}
          show={isOpen}
          onClose={closeModal}
          onConfirm={handleSaveGraph}
          onCancel={closeModal}
        >
          <p>Save graph changes to database?</p>
        </UnsavedChangesModal>
      </GenericLinkRefContext.Provider>
    </GenericNodeRefContext.Provider>
  );
}
