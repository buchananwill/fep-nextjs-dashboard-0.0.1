'use client';
import { DataNode, GraphDto } from '../../api/zod-mods';
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
import { GraphContext } from '../graph/graph-context-creator';
import { Card } from '@tremor/react';
import CurriculumDeliveryDetails from '../components/curriculum-delivery-details';
import { NodePayload } from '../force-graph-page';
import { WorkSeriesBundleDeliveryDto } from '../../api/dtos/WorkSeriesBundleDeliveryDtoSchema';
import { GraphViewer } from '../graph/graph-viewer';
import GraphForceAdjuster from '../components/graph-force-adjustment';
import NodeDetails from '../components/node-details';
import { AddNodesButton } from '../editing/add-nodes-button';
import {
  GenericLinkRefContext,
  useGenericLinkContext
} from '../links/generic-link-context-creator';
import {
  GenericNodeRefContext,
  useGenericNodeContext
} from '../nodes/generic-node-context-creator';
import { useFilteredLinkMemo } from '../aggregate-functions/use-filtered-link-memo';
import { useSelectiveContextDispatchBoolean } from '../../components/selective-context/selective-context-manager-boolean';
import AddLinksButton from '../editing/add-links-button';
import { DeleteLinksButton } from '../editing/delete-links-button';
import { DeleteNodesButton } from '../editing/delete-nodes-button';
import { BundleAssignmentsProvider } from '../../curriculum-models/contexts/bundle-assignments-provider';
import {
  StringMap,
  StringMapPayload
} from '../../curriculum-models/contexts/curriculum-models-context-creator';
import { BundleItemsContextProvider } from '../../curriculum-models/contexts/bundle-items-context-provider';
import { WorkSeriesSchemaBundleLeanDto } from '../../api/dtos/WorkSeriesSchemaBundleLeanDtoSchema';
import { useBundleAssignmentsContext } from '../../curriculum-models/contexts/use-bundle-assignments-context';
import { DisclosureThatGrowsOpen } from '../../components/disclosures/disclosure-that-grows-open';

export interface GraphTypeProps<T> {
  graphData: GraphDto<T>;
}

export default function CurriculumDeliveryGraph({
  children,
  bundles
}: GraphTypeProps<PartyDto> &
  PropsWithChildren & { bundles: WorkSeriesBundleDeliveryDto[] }) {
  const { nodes } = useGenericNodeContext<PartyDto>();
  const { links } = useGenericLinkContext<PartyDto>();
  const nodesRef = useRef(nodes);
  const linksRef = useRef(links);
  const { uniqueGraphName } = useContext(GraphContext);
  const mountedKey = useMemo(
    () => `${uniqueGraphName}-mounted`,
    [uniqueGraphName]
  );
  const { currentState, dispatchUpdate } = useSelectiveContextDispatchBoolean(
    mountedKey,
    mountedKey,
    true
  );

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
    const initialPayload = [] as StringMapPayload<string>[];
    const bundleAssignments = {} as StringMap<string>;
    bundles.forEach((bundleDeliveryDto) => {
      const partyIdString = bundleDeliveryDto.partyId.toString();
      const bundleIdString =
        bundleDeliveryDto.workSeriesSchemaBundle.id.toString();
      bundleAssignments[partyIdString] = bundleIdString;
      initialPayload.push({ key: partyIdString, data: bundleIdString });
    });

    return { bundleAssignments, initialPayload };
  }, [bundles]);

  useEffect(() => {
    dispatch({ type: 'updateAll', payload: initialPayload });
  }, [initialPayload, dispatch]);

  if (bundlesInNodeOrder.length !== nodes.length) {
    return <Card>Bundles not matching nodes!</Card>;
  }

  const classList: string[] = [];
  const descriptionList: string[] = [];

  nodes.forEach((n: DataNode<PartyDto>) => {
    classList.push(n.data.name);
    descriptionList.push(n.data.name);
  });

  const titleList = nodes.map((n: DataNode<PartyDto>) => n.data.partyType);

  const nodeDetailElements: NodePayload<PartyDto>[] = nodes.map(
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
                  <AddNodesButton relation={'sibling'}>
                    Add Sibling
                  </AddNodesButton>
                  <AddNodesButton relation={'child'}>Add Child</AddNodesButton>
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
      </GenericLinkRefContext.Provider>
    </GenericNodeRefContext.Provider>
  );
}
