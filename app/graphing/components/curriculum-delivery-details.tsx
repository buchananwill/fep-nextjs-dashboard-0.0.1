'use client';
import { DataNode } from '../../api/zod-mods';
import React, { useMemo } from 'react';
import { PartyDto } from '../../api/dtos/PartyDtoSchema';
import { WorkSeriesBundleDeliveryDto } from '../../api/dtos/WorkSeriesBundleDeliveryDtoSchema';
import { CheckIcon, PencilSquareIcon } from '@heroicons/react/20/solid';
import { WorkProjectSeriesSchemaDto } from '../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { isNotNull } from '../editing/graph-edits';
import { useCurriculumModelContext } from '../../curriculum-models/contexts/use-curriculum-model-context';
import {
  useBundleAssignmentsContext,
  useSingleBundleAssignment
} from '../../curriculum-models/contexts/use-bundle-assignments-context';
import { useBundleItemsContext } from '../../curriculum-models/contexts/use-bundle-Items-context';
import { Listbox } from '@headlessui/react';
import { schemaBundleKeyPrefix } from '../../curriculum-models/[yearGroup]/bundles/bundle-editor';
import { useSelectiveContextListenerStringList } from '../../components/selective-context/selective-context-manager-string-list';
import { OrganizationDto } from '../../api/dtos/OrganizationDtoSchema';
import { useSelectiveContextDispatchBoolean } from '../../components/selective-context/selective-context-manager-boolean';
import { UnsavedBundleAssignmentsKey } from '../../curriculum-models/contexts/bundle-assignments-provider';

export const EmptySchemasArray = [] as WorkProjectSeriesSchemaDto[];
export const EmptyStringArray = [] as string[];

export function sumDeliveryAllocations(
  schema: WorkProjectSeriesSchemaDto
): number {
  return schema
    ? schema.deliveryAllocations
        .map((da) => da.count * da.deliveryAllocationSize)
        .reduce((prev, curr) => prev + curr, 0)
    : 0;
}

export function sumAllSchemas(
  deliveryBundle: WorkProjectSeriesSchemaDto[]
): number {
  return deliveryBundle
    ? deliveryBundle
        .map(sumDeliveryAllocations)
        .reduce((prev, curr) => prev + curr, 0)
    : 0;
}

const cellFormatting = 'px-2 text-xs';
export default function CurriculumDeliveryDetails({
  node
}: {
  node: DataNode<OrganizationDto>;
}) {
  const { assignmentOptional, removeAssignment, setAssignment } =
    useSingleBundleAssignment(node.id.toString());
  const { bundleItemsMap } = useBundleItemsContext();
  const { selectiveListenerKey, selectiveContextKey } = useMemo(() => {
    const selectiveContextKey = `${schemaBundleKeyPrefix}${assignmentOptional}`;
    const selectiveListenerKey = `${selectiveContextKey}:${node.id}`;
    return { selectiveContextKey, selectiveListenerKey };
  }, [assignmentOptional, node]);
  const { curriculumModelsMap, dispatch } = useCurriculumModelContext();
  const { currentState: unsaved, dispatchWithoutControl } =
    useSelectiveContextDispatchBoolean(
      UnsavedBundleAssignmentsKey,
      selectiveListenerKey,
      false
    );
  const { currentState: schemaIdList } = useSelectiveContextListenerStringList(
    selectiveContextKey,
    selectiveListenerKey,
    EmptyStringArray
  );

  const { schemas, bundleRowSpan } = useMemo(() => {
    const schemas = schemaIdList
      .map((schemaId) => {
        return curriculumModelsMap[schemaId];
      })
      .filter(isNotNull<WorkProjectSeriesSchemaDto>);
    const bundleRowSpan = `span ${Math.max(schemaIdList.length, 1)}`;
    if (schemas.length > 0) return { schemas, bundleRowSpan };
    // }
    // }
    return { schemas: EmptySchemasArray, bundleRowSpan: 'span 1' };
  }, [schemaIdList, curriculumModelsMap]);

  const totalAllocation = useMemo(() => sumAllSchemas(schemas), [schemas]);

  const elements = schemas.map((workProjectSeriesSchema) => {
    return (
      <CourseSummary
        key={`${node.data.id}-${workProjectSeriesSchema.id}`}
        course={workProjectSeriesSchema}
      />
    );
  });

  const handleAssignmentChange = (assignmentId: string) => {
    console.log('Expected assigment', assignmentId);
    setAssignment(assignmentId);
    dispatchWithoutControl(true);
  };

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
          <Listbox value={assignmentOptional} onChange={handleAssignmentChange}>
            <Listbox.Button className={'btn w-full h-full relative'}>
              <div>{...elements}</div>
            </Listbox.Button>
            <Listbox.Options
              className={
                'absolute z-10 w-60 bg-gray-50 translate-y-2 drop-shadow-xl rounded-lg p-1'
              }
            >
              {Object.entries(bundleItemsMap).map((bundle) => (
                <Listbox.Option
                  value={bundle[0]}
                  key={`bundle-${bundle[0]}`}
                  className={({ active }) =>
                    `w-full grid grid-cols-6 items-center ${
                      active ? 'bg-emerald-300' : ''
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={'flex justify-center w-full'}>
                        {selected ? (
                          <CheckIcon className={'w-5 h-5 '}></CheckIcon>
                        ) : null}
                      </span>
                      <span className={'col-span-5'}>
                        Bundle {bundle[1].id}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
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
