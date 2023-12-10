'use client';
import { ButtonTransformer } from '../components/list-disclosure-panel';
import { StudentDTO } from '../api/dto-interfaces';
import React, { useContext } from 'react';
import TooltipsContext from '../components/tooltips/tooltips-context';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../components/tooltips/tooltip';
import { StandardTooltipContent } from '../components/tooltips/standard-tooltip-content';

export const ButtonStudent: ButtonTransformer<StudentDTO> = ({
  data: { name }
}) => {
  const { showTooltips } = useContext(TooltipsContext);
  return (
    <Tooltip enabled={showTooltips}>
      <TooltipTrigger className="w-full h-full text-left p-2">
        <span className="grow ml-2 w-full">{name}</span>
      </TooltipTrigger>
      <TooltipContent>
        <StandardTooltipContent>
          Click to view student elective preferences
        </StandardTooltipContent>
      </TooltipContent>
    </Tooltip>
  );
};
