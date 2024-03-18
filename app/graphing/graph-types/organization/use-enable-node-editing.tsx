import { TransientIdOffset } from '../../editing/graph-edits';
import React, { useContext } from 'react';
import { GraphContext } from '../../graph/graph-context-creator';
import { useSelectiveContextKeyMemo } from '../../../components/selective-context/use-selective-context-listener';
import { useSelectiveContextControllerBoolean } from '../../../components/selective-context/selective-context-manager-boolean';
import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { DataLink, DataNode, GraphDto } from '../../../api/zod-mods';
import { OrganizationDto } from '../../../api/dtos/OrganizationDtoSchema';
import { GenericFunctionWrapper } from '../../../components/selective-context/selective-context-manager-function';
import { useModal } from '../../../components/confirm-action-modal';
import { useNodeCloneFunction } from '../../editing/use-node-clone-function';
import { useRouter } from 'next/navigation';
import { useGraphEditButtonHooks } from '../../editing/use-graph-edit-button-hooks';
import { mapLinksBackToIdRefs } from '../../links/map-links-back-to-id-refs';
import {
  deleteLinks,
  deleteNodes,
  putOrganizationGraph
} from '../../../api/actions/curriculum-delivery-model';
import {
  CurriculumDeliveryGraphPageKey,
  UnsavedNodeDataContextKey
} from './curriculum-delivery-graph';
import { ActionResponsePromise } from '../../../api/actions/actionResponse';
import { UnsavedNodeChangesProps } from '../../graph/node-link-ref-wrapper';

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

export function useEnableNodeEditing<T extends HasNumberIdDto>(
  nodesRef: React.MutableRefObject<DataNode<T>[]>,
  linksRef: React.MutableRefObject<DataLink<T>[]>,
  cloneFunction: GenericFunctionWrapper<DataNode<T>, DataNode<T>>,
  putUpdatedGraph: (
    updatedGraph: GraphDto<T>
  ) => ActionResponsePromise<GraphDto<T>>
): UnsavedNodeChangesProps {
  const { unsavedGraphContextKey, unsavedGraphChanges, setUnsaved } =
    useUnsavedGraphChangesController();

  const { isOpen, closeModal, openModal } = useModal();

  useNodeCloneFunction(cloneFunction);
  const appRouterInstance = useRouter();

  const { deletedLinkIds, deletedNodeIds } = useGraphEditButtonHooks(
    CurriculumDeliveryGraphPageKey
  );

  const handleSaveGraph = () => {
    const nodes = nodesRef.current;
    const links = linksRef.current;
    if (links && nodes) {
      console.log('on their way to the database', nodes);
      const linksWithNumberIdRefs = links.map(mapLinksBackToIdRefs);

      const updatedGraph: GraphDto<T> = {
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
        putUpdatedGraph(updatedGraph).then((r) => {
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
  return {
    unsavedChanges: unsavedGraphChanges,
    show: isOpen,
    onClose: closeModal,
    onCancel: closeModal,
    handleOpen: openModal,
    onConfirm: handleSaveGraph
  };
}
