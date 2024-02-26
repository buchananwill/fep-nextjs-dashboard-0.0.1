'use client';
import { DataLink, DataNode } from '../../api/zod-mods';
import { ProductComponentStateDto } from '../../api/dtos/ProductComponentStateDtoSchema';
import { useContext } from 'react';
import { GenericNodeContext } from '../nodes/generic-node-context-creator';
import { GenericLinkContext } from '../links/generic-link-context-creator';
import { index } from 'd3';
import { PartyDto } from '../../api/dtos/PartyDtoSchema';
import { WorkProjectSeriesDeliveryDto } from '../../api/dtos/WorkProjectSeriesDeliveryDtoSchema';
import { WorkSeriesBundleDeliveryDto } from '../../api/dtos/WorkSeriesBundleDeliveryDtoSchema';

export default function CurriculumDeliveryDetails({
  deliveryBundle,
  node
}: {
  deliveryBundle?: WorkSeriesBundleDeliveryDto;
  node: DataNode<PartyDto>;
}) {
  const elements = deliveryBundle?.workProjectSeriesSchemaDtos.map(
    (workProjectSeriesSchema) => (
      <TaskItem
        key={`${node.data.id}-${workProjectSeriesSchema.id}`}
        taskElementLabel={'Course'}
        taskElementValue={workProjectSeriesSchema.name}
      />
    )
  );

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
        {elements && [...elements]}
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
