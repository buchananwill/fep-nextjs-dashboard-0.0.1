'use client';
import { DataNode } from '../../api/zod-mods';
import React, { useMemo } from 'react';
import { PartyDto } from '../../api/dtos/PartyDtoSchema';
import { WorkSeriesBundleDeliveryDto } from '../../api/dtos/WorkSeriesBundleDeliveryDtoSchema';
import { useCurriculumModelContext } from '../../curriculum-models/contexts/curriculum-models-context-creator';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import { WorkProjectSeriesSchemaDto } from '../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { isNotNull } from '../editing/graph-edits';

function sumDeliveryAllocations(schema: WorkProjectSeriesSchemaDto): number {
  return schema.deliveryAllocations
    .map((da) => da.count * da.deliveryAllocationSize)
    .reduce((prev, curr) => prev + curr, 0);
}

function sumAllSchemas(deliveryBundle: WorkProjectSeriesSchemaDto[]): number {
  return deliveryBundle
    .map(sumDeliveryAllocations)
    .reduce((prev, curr) => prev + curr, 0);
}

const cellFormatting = 'px-2 text-xs';
export default function CurriculumDeliveryDetails({
  deliveryBundle,
  node
}: {
  deliveryBundle?: WorkSeriesBundleDeliveryDto;
  node: DataNode<PartyDto>;
}) {
  const { curriculumModelsMap, dispatch } = useCurriculumModelContext();

  const bundleRowSpan = useMemo(() => {
    return deliveryBundle
      ? `span ${Math.max(
          deliveryBundle.workSeriesSchemaBundle.workProjectSeriesSchemaIds
            .length,
          1
        )}`
      : 1;
  }, [deliveryBundle]);

  const schemas = useMemo(() => {
    return deliveryBundle
      ? deliveryBundle.workSeriesSchemaBundle.workProjectSeriesSchemaIds
          .map((schemaId) => {
            return curriculumModelsMap[schemaId];
          })
          .filter(isNotNull<WorkProjectSeriesSchemaDto>)
      : [];
  }, [curriculumModelsMap, deliveryBundle]);

  const totalAllocation = useMemo(() => sumAllSchemas(schemas), [schemas]);

  const elements = schemas.map((workProjectSeriesSchema) => {
    return (
      <CourseSummary
        key={`${node.data.id}-${workProjectSeriesSchema.id}`}
        course={workProjectSeriesSchema}
      />
    );
  });

  const leftCol = 'text-xs w-full text-center h-full grid items-center';
  return (
    <div>
      <div className={'grid grid-cols-6 gap-1 mb-1'}>
        <div className={leftCol}>Block:</div>
        <div className={'col-start-2 col-span-5'}>
          <button className={'btn btn-xs w-full'}>
            {node.data.name} - Total Periods: {totalAllocation}
            <PencilSquareIcon className={'w-4 h-4'}></PencilSquareIcon>
          </button>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(6, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${Math.max(
            elements.length,
            1
          )}, minmax(0, 1fr))`,
          marginBottom: '0.25rem'
        }}
      >
        <div
          className={leftCol}
          style={{
            gridRow: bundleRowSpan
          }}
        >
          Bundle:
        </div>
        <div
          style={{
            gridColumn: `span 5`,
            gridRow: bundleRowSpan
          }}
        >
          <button className={'btn w-full h-full'}>
            <div>{...elements}</div>
          </button>
        </div>
      </div>
    </div>
  );
}

function CourseSummary({
  course
}: {
  course: WorkProjectSeriesSchemaDto;
}): React.JSX.Element {
  return (
    <div className={cellFormatting}>
      {course.workTaskType.name.substring(9)}, total periods:{' '}
      {course.deliveryAllocations
        .map((da) => da.count * da.deliveryAllocationSize)
        .reduce((prev, curr) => prev + curr, 0)}
    </div>
  );
}
