'use client';
import { Button, NumberInput } from '@tremor/react';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { ElectiveContext, ElectiveDispatchContext } from '../elective-context';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/20/solid';
import TooltipsContext from '../../generic/components/tooltips/tooltips-context';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../../generic/components/tooltips/tooltip';
import { StandardTooltipContentOld } from '../../generic/components/tooltips/standard-tooltip-content-old';

import '../../generic/css/custom-component-styles.css';

import { UpdateElectivePreference } from '../elective-reducers';
import { ElectivePreferenceDTO } from '../../api/dtos/ElectivePreferenceDTOSchema';
import {
  ConfirmActionModal,
  useModal
} from '../../generic/components/modals/confirm-action-modal';

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
  const dispatch = useContext(ElectiveDispatchContext);
  const { show, openModal, onClose } = useModal();
  const [rotationNumber, setRotationNumber] = useState(0);

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (rotationNumber > filteredStudents.length) {
      setShowError(true);
    } else setShowError(false);
  }, [rotationNumber, setRotationNumber, filteredStudents.length]);

  const handleRotationConfirm = async (number: number) => {
    if (filteredStudents.length == 0 || filterType == 'any') return;
    const slicedFilteredList = filteredStudents
      .slice(0, number)
      .map((student) => student.id);
    const carouselOptionIdList: number[] = [];
    carouselOptionIdSet.forEach((id) => carouselOptionIdList.push(id));

    const response = await fetch('option-block-assignments', {
      method: 'PUT',
      cache: 'no-store',
      body: JSON.stringify({
        forwardingUrl: 'put-carousel-option-student-rotation',
        forwardingBody: {
          studentIdList: slicedFilteredList,
          carouselOptionIdList: carouselOptionIdList,
          rotationDirection: direction == 'LEFT' ? -1 : 1
        }
      })
    });

    const bodyResponse: ElectivePreferenceDTO[] = await response.json();

    bodyResponse.forEach((preference) => {
      const dispatchRequest: UpdateElectivePreference = {
        type: 'updateElectivePreference',
        electivePreference: preference
      };
      dispatch(dispatchRequest);
    });
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
          <StandardTooltipContentOld>
            If any <strong>students</strong> are enrolled in{' '}
            <strong>all</strong> the highlighted <strong>options</strong>, and
            each <strong>option</strong> is present in the next{' '}
            <strong>block</strong> also, <strong>students</strong> can be
            automatically re-allocated from the highlighted{' '}
            <strong>options</strong> (decreasing their enrollment count) to the
            corresponding <strong>option</strong> in the next{' '}
            <strong>block</strong>. The last <strong>option</strong> in the
            direction of rotation wraps back to the first
            <strong> block</strong>.
          </StandardTooltipContentOld>
        </TooltipContent>
      </Tooltip>
      <ConfirmActionModal
        show={show}
        onClose={() => onClose()}
        onConfirm={() => {
          handleRotationConfirm(rotationNumber);
          onClose();
        }}
        onCancel={() => {
          onClose();
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
      </ConfirmActionModal>
    </>
  );
}
