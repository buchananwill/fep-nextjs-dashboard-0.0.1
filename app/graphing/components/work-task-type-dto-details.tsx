'use client';
import { DataLink, DataNode } from '../../api/zod-mods';
import { ProductComponentStateDto } from '../../api/dtos/ProductComponentStateDtoSchema';
import { useContext } from 'react';
import { GenericNodeContext } from '../nodes/generic-node-context-creator';
import { GenericLinkContext } from '../links/generic-link-context-creator';
import { index } from 'd3';
import { WorkTaskTypeDto } from '../../api/dtos/WorkTaskTypeDtoSchema';

export default function WorkTaskTypeDtoDetails({
  node
}: {
  node: DataNode<WorkTaskTypeDto>;
}) {
  const nodeContext = useContext(GenericNodeContext);
  const linkContext = useContext(GenericLinkContext);
  const nodes = (nodeContext?.nodes as DataNode<WorkTaskTypeDto>[]) || [];
  const links = (linkContext?.links as DataLink<WorkTaskTypeDto>[]) || [];
  const dependencyNodes = links
    .filter((l) => (l.source as DataNode<WorkTaskTypeDto>).id == node.id)
    .map((l) => l.target as DataNode<WorkTaskTypeDto>)
    .map((n, index) => (
      <TaskItem
        key={n.id}
        taskElementLabel={`Dependency ${index + 1}:`}
        taskElementValue={n.data.name}
      />
    ));

  const noTransformation = {};

  return (
    <table className={'p-2 divide-y'}>
      <tbody>
        <TaskItem
          taskElementLabel={'Group:'}
          taskElementValue={node.data.name}
        ></TaskItem>
        {/*<TaskItem*/}
        {/*  taskElementLabel={'Attached To:'}*/}
        {/*  taskElementValue={node.data.}*/}
        {/*></TaskItem>*/}
        {...dependencyNodes}
      </tbody>
    </table>
  );
}

function TaskItem({
  taskElementLabel,
  taskElementValue
}: {
  taskElementLabel: string;
  taskElementValue: string;
}) {
  return (
    <tr>
      <td className={'px-2 text-xs'}>{taskElementLabel}</td>
      <td className={'px-2 text-xs'}>{taskElementValue}</td>
    </tr>
  );
}