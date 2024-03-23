'use client';
import { DisclosureLabelTransformer } from '../components/disclosure-list/disclosure-list-panel';

import React, { useContext } from 'react';
import TooltipsContext from '../components/tooltips/tooltips-context';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../components/tooltips/tooltip';
import { StandardTooltipContentOld } from '../components/tooltips/standard-tooltip-content-old';
import { StudentDTO } from '../api/dtos/StudentDTOSchema';

export const ButtonStudent: DisclosureLabelTransformer<StudentDTO> = ({
  data: { name }
}) => {
  const { showTooltips } = useContext(TooltipsContext);
  return (
    <Tooltip enabled={showTooltips}>
      <TooltipTrigger className="w-full h-full text-left p-2">
        <span className="grow ml-2 w-full">{name}</span>
      </TooltipTrigger>
      <TooltipContent>
        <StandardTooltipContentOld>
          Click the <strong>name tag</strong> to view student elective
          preferences
        </StandardTooltipContentOld>
      </TooltipContent>
    </Tooltip>
  );
};
