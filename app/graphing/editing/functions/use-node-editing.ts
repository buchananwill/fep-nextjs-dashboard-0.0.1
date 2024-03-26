'use client';
import { TransientIdOffset } from './graph-edits';
import React, { useContext } from 'react';
import { GraphContext } from '../../graph/graph-context-creator';
import { useSelectiveContextKeyMemo } from '../../../generic/hooks/selective-context/use-selective-context-listener';
import { useSelectiveContextControllerBoolean } from '../../../generic/components/selective-context/selective-context-manager-boolean';
import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import {
  DataLink,
  DataNode,
  GraphDto,
  GraphDtoPutRequestBody
} from '../../../api/zod-mods';
import { GenericFunctionWrapper } from '../../../generic/components/selective-context/selective-context-manager-function';

import { useNodeCloneFunction } from './use-node-clone-function';
import { useRouter } from 'next/navigation';
import { useGraphEditButtonHooks } from './use-graph-edit-button-hooks';
import { mapLinksBackToIdRefs } from '../../links/map-links-back-to-id-refs';
import {
  CurriculumDeliveryGraphPageKey,
  UnsavedNodeDataContextKey
} from '../../graph-types/organization/curriculum-delivery-graph';
import { ActionResponsePromise } from '../../../api/actions/actionResponse';
import { UnsavedNodeChangesProps } from '../../graph/node-link-ref-wrapper';
import { useShowNodeEditing } from '../../show-node-editing';
import { useModal } from '../../../generic/components/modals/confirm-action-modal';

function removeTransientId(id: number) {
  return id < TransientIdOffset;
}

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

export function useNodeEditing<T extends HasNumberIdDto>(
  nodesRef: React.MutableRefObject<DataNode<T>[]>,
  linksRef: React.MutableRefObject<DataLink<T>[]>,
  cloneFunction: GenericFunctionWrapper<DataNode<T>, DataNode<T>>,

  putUpdatedGraph: (
    updatedGraph: GraphDtoPutRequestBody<T>
  ) => ActionResponsePromise<GraphDto<T>>
): UnsavedNodeChangesProps {
  const { unsavedGraphContextKey, unsavedGraphChanges, setUnsaved } =
    useUnsavedGraphChangesController();

  const { isOpen, closeModal, openModal } = useModal();
  useShowNodeEditing(true);
  useNodeCloneFunction(cloneFunction);
  const appRouterInstance = useRouter();

  const { deletedLinkIds, deletedNodeIds } = useGraphEditButtonHooks(
    CurriculumDeliveryGraphPageKey
  );

  const handleSaveGraph = () => {
    const nodes = nodesRef.current;
    const links = linksRef.current;
    if (links && nodes) {
      const linksWithNumberIdRefs = links.map(mapLinksBackToIdRefs);

      const updatedGraph: GraphDto<T> = {
        nodes: nodes,
        closureDtos: linksWithNumberIdRefs
      };
      const deletedLinkNonTransientIds =
        deletedLinkIds.filter(removeTransientId);
      const deletedNodeNonTransientIds =
        deletedNodeIds.filter(removeTransientId);

      const request: GraphDtoPutRequestBody<T> = {
        graphDto: updatedGraph,
        deletedClosureIdList: deletedLinkNonTransientIds,
        deletedNodeIdList: deletedNodeNonTransientIds
      };

      putUpdatedGraph(request).then((r) => {
        if (r.status == 200) {
        }
      });

      setUnsaved({ contextKey: unsavedGraphContextKey, value: false });
      appRouterInstance.refresh();
      closeModal();
    }
  };
  return {
    unsavedChanges: unsavedGraphChanges,
    show: isOpen,
    onClose: closeModal,
    onCancel: closeModal,
    handleOpen: openModal,
    onConfirm: handleSaveGraph
  };
}
