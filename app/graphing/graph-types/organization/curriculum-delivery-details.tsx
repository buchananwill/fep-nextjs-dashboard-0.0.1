'use client';
import { DataNode } from '../../../api/zod-mods';
import React, { forwardRef, Fragment } from 'react';
import { CheckIcon, PencilSquareIcon } from '@heroicons/react/20/solid';
import { WorkProjectSeriesSchemaDto } from '../../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { Listbox } from '@headlessui/react';
import { OrganizationDto } from '../../../api/dtos/OrganizationDtoSchema';

import { useNodeNameEditing } from '../../editing/functions/use-node-name-editing';
import { useSumAllSchemasMemo } from '../../../curriculum/delivery-models/functions/use-sum-all-schemas-memo';
import { useSchemaBundleAssignmentContext } from '../../../curriculum/delivery-models/functions/use-schema-bundle-assignment-context';
import { RenameModal } from '../../../generic/components/modals/rename-modal';
import { GenericButtonProps } from '../../../generic/components/buttons/rename-button';

export const LeftCol =
  'text-xs w-full text-center h-full flex items-center justify-center';
export const CurriculumDetailsListenerKey = 'curriculum-details';

export default function CurriculumDeliveryDetails({
  node
}: {
  node: DataNode<OrganizationDto>;
}) {
  const { id } = node;
  const {
    assignmentOptional,
    setAssignment,
    bundleItemsMap,
    dispatchWithoutControl,
    schemas
  } = useSchemaBundleAssignmentContext(id);

  const componentListenerKey = `${CurriculumDetailsListenerKey}:${id}`;

  const { openModal, renameModalProps } = useNodeNameEditing(
    node,
    componentListenerKey
  );
  const bundleRowSpan = `span ${Math.max(schemas.length, 1) + 1}`;

  const totalAllocation = useSumAllSchemasMemo(schemas);

  const elements = schemas.map((workProjectSeriesSchema) => {
    return (
      <CourseSummary
        key={`${node.data.id}-${workProjectSeriesSchema.id}`}
        course={workProjectSeriesSchema}
      />
    );
  });

  const handleAssignmentChange = (assignmentId: string) => {
    setAssignment(assignmentId);
    dispatchWithoutControl(true);
  };

  return (
    <div className={'mt-1'}>
      <div className={'grid grid-cols-6 gap-1 mb-1'}>
        <div className={LeftCol}>Block:</div>
        <div className={'col-start-2 col-span-5'}>
          <button className={'btn btn-xs w-full'} onClick={openModal}>
            <PencilSquareIcon className={'w-4 h-4'}></PencilSquareIcon>
            {node.data.name} - Total Periods: {totalAllocation}
          </button>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(6, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${
            Math.max(elements.length, 1) + 1
          }, minmax(0, 1fr))`,
          marginBottom: '0.25rem'
        }}
      >
        <div
          className={LeftCol}
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
            <Listbox.Button
              as={NodeDetailsListBoxButton}
              // className={'btn w-full h-full relative px-1'}
            >
              <table className={'text-left w-full'}>
                <thead className={'text-sm border-b-2'}>
                  <tr>
                    <th>Periods</th>
                    <th>Item</th>
                  </tr>
                </thead>
                <tbody>{...elements}</tbody>
              </table>
            </Listbox.Button>
            <Listbox.Options as={NodeDetailsListBoxOptions}>
              {Object.entries(bundleItemsMap).map((bundle) => (
                <Listbox.Option
                  value={bundle[0]}
                  key={`bundle-${bundle[0]}`}
                  as={Fragment}
                >
                  {({ selected, active }) => (
                    <NodeDetailsListBoxOption
                      selected={selected}
                      active={active}
                    >
                      Bundle {bundle[1].id}
                    </NodeDetailsListBoxOption>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>
      </div>
      <RenameModal {...renameModalProps} />
    </div>
  );
}

function CourseSummary({
  course
}: {
  course: WorkProjectSeriesSchemaDto;
}): React.JSX.Element {
  return (
    <tr className={'text-xs border-b last:border-0'}>
      <td>
        {course.deliveryAllocations
          .map((da) => da.count * da.deliveryAllocationSize)
          .reduce((prev, curr) => prev + curr, 0)}
      </td>
      <td>{course.workTaskType.name.substring(9)}</td>
    </tr>
  );
}

export const NodeDetailsListBoxButton = forwardRef(
  function NodeDetailsListBoxButton(
    { children, ...props }: Omit<GenericButtonProps, 'className'>,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) {
    return (
      <button
        className={'btn w-full h-full relative px-1'}
        {...props}
        ref={ref}
      >
        {children}
      </button>
    );
  }
);

type GenericUListProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
>;
type GenericLIProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLLIElement>,
  HTMLLIElement
>;

export type optionsWidth = 'w-48' | 'w-60' | 'w-72' | 'w-96';

export const NodeDetailsListBoxOptions = forwardRef(
  function NodeDetailsListBoxOptions(
    {
      children,
      optionsWidth = 'w-72',
      ...props
    }: Omit<GenericUListProps, 'className'> & { optionsWidth?: optionsWidth },
    ref: React.ForwardedRef<HTMLUListElement>
  ) {
    return (
      <div className={optionsWidth + ' absolute z-10 pt-2'}>
        <ul
          className={
            ' bg-gray-50 bottom drop-shadow-xl rounded-lg p-1 max-h-60 overflow-auto'
          }
          {...props}
          ref={ref}
        >
          {children}
        </ul>
      </div>
    );
  }
);

export const NodeDetailsListBoxOption = forwardRef(
  function NodeDetailsListBoxOption(
    {
      children,
      active,
      selected,
      disabled,
      ...props
    }: Omit<GenericLIProps, 'className'> & {
      active?: boolean;
      selected?: boolean;
      disabled?: boolean;
    },
    ref: React.ForwardedRef<HTMLLIElement>
  ) {
    return (
      <li
        className={`w-full grid grid-cols-6 items-center cursor-pointer ${
          active ? 'bg-emerald-300' : ''
        }`}
        {...props}
        ref={ref}
      >
        {' '}
        <span className={'flex justify-center w-full'}>
          {selected ? <CheckIcon className={'w-5 h-5 '}></CheckIcon> : null}
        </span>
        <span className={'col-span-5'}>{children}</span>
      </li>
    );
  }
);
