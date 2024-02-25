'use client';
import { DataLink, DataNode } from '../../api/zod-mods';
import { ProductComponentStateDto } from '../../api/dtos/ProductComponentStateDtoSchema';
import { useContext } from 'react';
import { GenericNodeContext } from '../nodes/generic-node-context-creator';
import { GenericLinkContext } from '../links/generic-link-context-creator';
import { index } from 'd3';
import { PartyDto } from '../../api/dtos/PartyDtoSchema';
import { WorkProjectSeriesDeliveryDto } from '../../api/dtos/WorkProjectSeriesDeliveryDtoSchema';

export default function CurriculumDeliveryDetails({
  deliveryList,
  node
}: {
  deliveryList: WorkProjectSeriesDeliveryDto[];
  node: DataNode<PartyDto>;
}) {
  const elements = deliveryList.map((delivery) => (
    <TaskItem
      key={`${node.data.id}-${delivery.workProjectSeriesSchema.id}`}
      taskElementLabel={'Course'}
      taskElementValue={delivery.workProjectSeriesSchema.name}
    />
  ));

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
        {[...elements]}
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
