'use client';
import { DataNode } from '../../../api/zod-mods';
import React from 'react';
import { WorkTaskTypeDto } from '../../../api/dtos/WorkTaskTypeDtoSchema';
import { StringMap } from '../../../contexts/string-map-context/string-map-reducer';
import { useDirectSimRefEditsDispatch } from '../../editing/functions/use-graph-edit-button-hooks';
import {
  RenameWorkTaskType,
  WorkTaskTypeDtoDetailsListenerKey
} from './rename-work-task-type';
import { useSelectiveContextGlobalListener } from '../../../selective-context/components/global/selective-context-manager-global';
import { getNameSpacedKey } from '../../../selective-context/components/controllers/dto-id-list-controller';
import { KnowledgeDomainDto } from '../../../api/dtos/KnowledgeDomainDtoSchema';
import { KnowledgeLevelDto } from '../../../api/dtos/KnowledgeLevelDtoSchema';
import { AssignItemFromObjectEntries } from './assign-item-from-object-entries';
import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { ObjectPlaceholder } from '../../../api/main';

export interface NodeDetailsUiComponentProps<T extends HasNumberIdDto> {
  node: DataNode<T>;
}

export default function WorkTaskTypeDtoDetails({
  node
}: NodeDetailsUiComponentProps<WorkTaskTypeDto>) {
  const { id, data } = node;
  const { knowledgeDomainId, knowledgeLevelId } = data;

  const { currentState: kDomainMap } = useSelectiveContextGlobalListener<
    StringMap<KnowledgeDomainDto>
  >({
    contextKey: getNameSpacedKey('knowledgeDomain', 'stringMap'),
    listenerKey: `workTaskType:${node.id}:details`,
    initialValue: ObjectPlaceholder
  });
  const { currentState: kLevelMap } = useSelectiveContextGlobalListener<
    StringMap<KnowledgeLevelDto>
  >({
    contextKey: getNameSpacedKey('knowledgeLevel', 'stringMap'),
    listenerKey: `workTaskType:${node.id}:details`,
    initialValue: ObjectPlaceholder
  });

  console.log(kLevelMap, kDomainMap, node);

  console.log(knowledgeDomainId, knowledgeLevelId);

  const editListenerKey = `${WorkTaskTypeDtoDetailsListenerKey}-${id}`;

  const { incrementSimVersion, nodeListRef } =
    useDirectSimRefEditsDispatch<WorkTaskTypeDto>(editListenerKey);

  const handleKnowledgeDomainChange = (domainId: string) => {
    const updatedDomain: KnowledgeDomainDto = kDomainMap[domainId];
    if (nodeListRef === null) return;
    const find = nodeListRef.current.find((n) => n.id === id);
    if (find === undefined) return;
    find.data.knowledgeDomainId = updatedDomain.id;
    find.data.knowledgeDomainName = updatedDomain.name;
    incrementSimVersion();
  };
  const handleKnowledgeLevelChange = (id: string) => {
    console.log('(Not implemented) New id:', id);
  };

  return (
    <div className={'mt-1'}>
      <div className={'grid grid-cols-3 gap-1 mb-1'}>
        <RenameWorkTaskType node={node} />
        <AssignItemFromObjectEntries
          itemDescriptor={'Subject'}
          currentAssignment={`${knowledgeDomainId}`}
          onChange={handleKnowledgeDomainChange}
          optionsMap={kDomainMap}
          labelAccessor={(kd) => kd.name}
          idAccessor={(kd) => kd.id.toString()}
        />
        <AssignItemFromObjectEntries
          itemDescriptor={'Year'}
          currentAssignment={`${knowledgeLevelId}`}
          onChange={handleKnowledgeLevelChange}
          optionsMap={kLevelMap}
          labelAccessor={(kl) => kl.name}
          idAccessor={(kl) => kl.id.toString()}
        />
      </div>
    </div>
  );
}
