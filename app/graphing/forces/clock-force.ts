import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';
import { DataNode } from '../../api/zod-mods';
import { useMemo } from 'react';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';

export function useClockForce<T extends HasNumberIdDto>(
  nodesMutable: DataNode<T>[],
  width: number = 720,
  height: number = 720,
  centreStrength: number = 0.5
): {
  forceX?: d3.ForceX<DataNode<T>>;
  forceY?: d3.ForceY<DataNode<T>>;
} {
  return useMemo(() => {
    const firstChildren = nodesMutable.filter(
      (nextNode) => nextNode.distanceFromRoot == 1
    );

    const anglePerChild = (Math.PI * 2) / firstChildren.length;
    const childClockPositions = firstChildren.map((childNode, index) => {
      const radius = 30;
      const xCoordinate = width / 2 + radius * Math.cos(anglePerChild * index);
      const yCoordinate = height / 2 + radius * Math.sin(anglePerChild * index);
      return {
        id: childNode.id,
        x: xCoordinate,
        y: yCoordinate
      };
    });

    const xForcePos = (nodeElement: SimulationNodeDatum) => {
      const completeNode = nodeElement as DataNode<T>;
      const find = childClockPositions.find(
        (child) => child.id == completeNode.id
      );
      return find?.x || 0;
    };

    const yForcePos = (nodeElement: SimulationNodeDatum) => {
      const completeNode = nodeElement as DataNode<T>;
      const find = childClockPositions.find(
        (child) => child.id == completeNode.id
      );
      return find?.y || 0;
    };

    const positionForceStrength = (nodeElement: SimulationNodeDatum) => {
      const completeNode = nodeElement as DataNode<T>;
      return childClockPositions.some((child) => child.id == completeNode.id)
        ? centreStrength
        : 0;
    };
    const forceX = d3.forceX().x(xForcePos).strength(positionForceStrength);
    const forceY = d3.forceY().y(yForcePos).strength(positionForceStrength);
    return { forceX, forceY };
  }, [nodesMutable, width, height, centreStrength]);
}
