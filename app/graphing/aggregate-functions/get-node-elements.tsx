import { DataNode } from '../../api/zod-mods';
import { NodeComponent } from '../nodes/node-component';
import React, { ReactElement, ReactSVGElement, useContext } from 'react';
import { PartyDto } from '../../api/dtos/PartyDtoSchema';
import { WorkSeriesBundleDeliveryDto } from '../../api/dtos/WorkSeriesBundleDeliveryDtoSchema';
import { WorkProjectSeriesSchemaDto } from '../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { index } from 'd3';
import { NodeComponentContext } from '../nodes/node-component-context';

import { useCurriculumModelContext } from '../../curriculum-models/contexts/use-curriculum-model-context';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';

export function useBasicNodeElements<T extends HasNumberIdDto>(
  nodes: DataNode<T>[]
) {
  const nodeComponentSource = useContext(NodeComponentContext);
  let getter = nodeComponentSource.getNodeElements;
  if (getter) {
    return getter();
  }

  return nodes.map((d, index) => (
    <NodeComponent
      key={`node-${d.id}`}
      enableRunnable={true}
      nodeIndex={index}
      nodeId={d.id}
    />
  ));
}

export function useWorkSeriesBundleNodeElements<T extends HasNumberIdDto>(
  nodes: DataNode<PartyDto>[],
  bundles: WorkSeriesBundleDeliveryDto[]
) {
  const { curriculumModelsMap } = useCurriculumModelContext();
  return nodes.map((d, index) => {
    const workSeriesBundleDeliveryDto = bundles[index];
    const numberOfSchemas =
      workSeriesBundleDeliveryDto.workSeriesSchemaBundle
        .workProjectSeriesSchemaIds.length;
    const elements =
      workSeriesBundleDeliveryDto.workSeriesSchemaBundle.workProjectSeriesSchemaIds.map(
        (schemaId, index) => {
          const optionalSchema = curriculumModelsMap[schemaId];
          if (optionalSchema) {
            const schema = optionalSchema;
            return (
              <g
                key={schema.id}
                transform={`translate(${0} ${index * 32})`}
                pointerEvents={'none'}
              >
                <WorkSeriesSchemaSvgFragment
                  schema={schema}
                  schemaIndex={index}
                />
              </g>
            );
          }
        }
      );

    return (
      <NodeComponent
        key={`node-${d.id}`}
        enableRunnable={true}
        nodeIndex={index}
        nodeId={d.id}
      >
        <g transform={`translate(0 ${-numberOfSchemas * 16})`}>{...elements}</g>
      </NodeComponent>
    );
  });
}

function WorkSeriesSchemaSvgFragment({
  schema,
  schemaIndex
}: {
  schema: WorkProjectSeriesSchemaDto;
  schemaIndex: number;
}) {
  const allocation = schema.deliveryAllocations.map(
    (allocation, allocationIndex) => {
      const allocationKey = `${schema.id}-${allocation.id}`;
      const units: ReactElement[] = [];
      for (let i = 0; i < allocation.count; i++) {
        units.push(
          <rect
            width={allocation.deliveryAllocationSize * 16}
            height={16}
            x={i * allocation.deliveryAllocationSize * 16 + 2}
            y={allocationIndex * -16}
            className={'stroke-blue-600 fill-transparent'}
            key={`${allocationKey}-${i}`}
          ></rect>
        );
      }
      return <g key={`${schema.id}-${allocation.id}`}>{...units}</g>;
    }
  );
  return <g>{...allocation}</g>;
}
