'use client';
import { Button, NumberInput } from '@tremor/react';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { ElectiveContext } from '../elective-context';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/20/solid';
import TooltipsContext from '../../components/tooltips/tooltips-context';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../../components/tooltips/tooltip';
import { StandardTooltipContent } from '../../components/tooltips/standard-tooltip-content';
import {
  ConfirmationModal,
  useModal
} from '../../components/confirmation-modal';
import '../../components/custom-component-styles.css';

export type direction = 'LEFT' | 'RIGHT';

function getButton(direction: 'LEFT' | 'RIGHT') {
  return (
    <>
      {direction == 'LEFT' && (
        <>
          <ArrowLeftIcon className="h-5 w-5 inline group-hover:-translate-x-2 transition-transform ease-in-out duration-300 mr-1" />
          Rotate Students Left
        </>
      )}
      {direction == 'RIGHT' && (
        <>
          {' '}
          Rotate Students Right
          <ArrowRightIcon className="h-5 w-5 inline group-hover:translate-x-2 transition-transform ease-in-out duration-300 ml-1" />
        </>
      )}
    </>
  );
}

export function RotateCarouselButton({
  children,
  direction
}: {
  children?: ReactNode;
  direction: direction;
}) {
  const { filteredStudents, carouselOptionIdSet, filterType } =
    useContext(ElectiveContext);
  const { showTooltips } = useContext(TooltipsContext);
  const { isOpen, openModal, closeModal } = useModal();
  const [rotationNumber, setRotationNumber] = useState(0);

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (rotationNumber > filteredStudents.length) {
      setShowError(true);
    } else setShowError(false);
  }, [rotationNumber, setRotationNumber, filteredStudents.length]);

  const handleRotationConfirm = (number: number) => {
    if (filteredStudents.length == 0 || filterType == 'any') return;
    const slicedFilteredList = filteredStudents.slice(0, number);
    console.log(
      'Confirming the rotation of these students: ',
      slicedFilteredList
    );
    console.log(
      'In these Carousel Options: ',
      { filteredStudents, carouselOptionIdSet }.carouselOptionIdSet
    );
  };

  return (
    <>
      <Tooltip enabled={showTooltips}>
        <TooltipTrigger>
          <Button
            variant="secondary"
            className="text-gray-500 flex group border-gray-500 hover:border-transparent active:outline-accent w-48"
            color="emerald"
            onClick={() => openModal()}
          >
            {children}
            {getButton(direction)}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <StandardTooltipContent>
            Rotate the filtered students between the highlighted Carousel
            Options.
          </StandardTooltipContent>
        </TooltipContent>
      </Tooltip>
      <ConfirmationModal
        show={isOpen}
        onClose={() => closeModal()}
        onConfirm={() => {
          handleRotationConfirm(rotationNumber);
          closeModal();
        }}
        onCancel={() => {
          console.log('Cancelled!');
          closeModal();
        }}
      >
        {filterType == 'all' ? (
          <>
            <div className="pb-2">
              How many students? Max:{' '}
              {
                { filteredStudents, carouselOptionIdSet }.filteredStudents
                  .length
              }
            </div>

            <NumberInput
              // type={'number'}
              max={
                { filteredStudents, carouselOptionIdSet }.filteredStudents
                  .length
              }
              min={0}
              value={rotationNumber}
              error={showError}
              className="rounded-md outline-2 border-2 border-gray-200 p-1 flex"
              onChange={(e) =>
                setRotationNumber(parseInt(e.target.value) || NaN)
              }
              errorMessage={`Students entered: ${rotationNumber}, max value: ${filteredStudents.length}`}
            ></NumberInput>
          </>
        ) : (
          <>
            {' '}
            Incorrect filter type selected. Please select{' '}
            <strong>Match All</strong> to bulk rotate students.
          </>
        )}
      </ConfirmationModal>
    </>
  );
}
