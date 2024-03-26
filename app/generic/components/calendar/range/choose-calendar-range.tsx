'use client';
import React, { ReactNode, useContext } from 'react';
import {
  CalendarRangeContext,
  CalendarRangeDispatch
} from './calendar-range-context';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon
} from '@heroicons/react/20/solid';
import { ArithmeticByDays, MONTHS, SetRange } from './calendar-range-reducers';
import { DateRangePicker, DateRangePickerValue, Title } from '@tremor/react';
import { interval } from 'date-fns/interval';
import { Disclosure } from '@headlessui/react';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import ZoomBothAxes from '../../zoom/zoom-both-axes';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../../tooltips/tooltip';
import { StandardTooltipContent } from '../../tooltips/standard-tooltip-content';
type TooltipOptions =
  | 'minusWeek'
  | 'minusDay'
  | 'plusWeek'
  | 'plusDay'
  | 'adjustRange';

const tooltips: { [key: string]: string } = {
  minusWeek: 'Back one week.',
  minusDay: 'Back one day.',
  adjustRange: 'Click to select date range or adjust zoom.',
  plusWeek: 'Forward one week.',
  plusDay: 'Forward one day.'
};

const LocalToolTip = ({
  children,
  option
}: {
  option: TooltipOptions;
  children: ReactNode;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>

      <StandardTooltipContent>{tooltips[option]}</StandardTooltipContent>
    </Tooltip>
  );
};

export function ChooseCalendarRange() {
  const range = useContext(CalendarRangeContext);
  const start = range?.start;
  const end = range?.end;
  const dispatch = useContext(CalendarRangeDispatch);
  const handleRangeUpdate = (days: number) => {
    const dispatchArg: ArithmeticByDays = {
      type: 'arithmeticByDays',
      amount: days
    };
    dispatch(dispatchArg);
  };
  let monthLabel = '';
  if (start && end) {
    const startMonth = MONTHS[start.getMonth()];
    const endMonth =
      start.getMonth() == end.getMonth() ? '' : ' - ' + MONTHS[end.getMonth()];
    const startYear =
      start.getFullYear() == end.getFullYear() ? '' : ' ' + start.getFullYear();
    const endYear = ' ' + end.getFullYear();
    monthLabel = `${startMonth}${startYear}${endMonth}${endYear}`;
  }

  const setDatePickerValue = ({ from, to }: DateRangePickerValue) => {
    const dateNormalizedInterval = from && to ? interval(from, to) : undefined;
    const dispatchArg: SetRange = {
      type: 'setRange',
      range: dateNormalizedInterval
    };
    dispatch(dispatchArg);
  };

  return (
    <Disclosure as="div">
      {({ open }) => (
        <>
          <div className=" flex justify-center">
            <div className="flex items-center ">
              <LocalToolTip option={'minusWeek'}>
                <button
                  className="btn-sm btn m-2"
                  onClick={() => handleRangeUpdate(-7)}
                >
                  <ArrowLeftIcon className="h-4 w-4 m-0"></ArrowLeftIcon>Week
                </button>
              </LocalToolTip>

              <LocalToolTip option={'minusDay'}>
                <button
                  className="btn-sm btn m-2"
                  onClick={() => handleRangeUpdate(-1)}
                >
                  <ArrowLeftIcon className="h-4 w-4 m-0"></ArrowLeftIcon>Day
                </button>
              </LocalToolTip>
              <LocalToolTip option={'adjustRange'}>
                <Disclosure.Button className="mb-2 inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                  <Title className="text-center border-gray-400 border w-56 p-2 rounded-xl ">
                    {monthLabel}
                  </Title>

                  {open ? (
                    <ChevronLeftIcon
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronDownIcon
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  )}
                </Disclosure.Button>
              </LocalToolTip>
              <div className="ml-4"></div>
              <LocalToolTip option={'plusDay'}>
                <button
                  className="btn btn-sm m-2"
                  onClick={() => handleRangeUpdate(1)}
                >
                  Day<ArrowRightIcon className="h-4 w-4"></ArrowRightIcon>
                </button>
              </LocalToolTip>
              <LocalToolTip option={'plusWeek'}>
                <button
                  className="btn btn-sm m-2"
                  onClick={() => handleRangeUpdate(7)}
                >
                  Week<ArrowRightIcon className="h-4 w-4"></ArrowRightIcon>
                </button>
              </LocalToolTip>
            </div>
          </div>
          <Disclosure.Panel>
            <div className="flex flex-col items-center">
              <div className="flex items-center p-2 justify-center">
                <div className="z-40">
                  <DateRangePicker
                    value={{ from: start, to: end }}
                    weekStartsOn={1}
                    enableClear={true}
                    enableYearNavigation={true}
                    enableSelect={false}
                    onValueChange={(value) => setDatePickerValue(value)}
                  ></DateRangePicker>
                </div>
                <span className={'ml-4 mr-2'}>Adjust scale:</span>{' '}
                <ZoomBothAxes />
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
