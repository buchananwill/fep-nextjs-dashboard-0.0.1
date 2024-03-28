'use client';
import React from 'react';
import { useSelectiveContextDispatchNumberList } from '../selective-context/selective-context-manager-number-list';
import { Tooltip, TooltipTrigger } from '../tooltips/tooltip';
import { StandardTooltipContent } from '../tooltips/standard-tooltip-content';
import { EmptyArray } from '../../../api/main';
import { StarIcon as StarIconFilled } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

export default function ListItemSelector({
  itemDescriptor,
  itemListKey,
  selectorListenerKey,
  itemId
}: {
  itemDescriptor: string;
  itemListKey: string;
  selectorListenerKey: string;
  itemId: number;
}) {
  const {
    currentState: selectionList,
    dispatchWithoutControl: setSelectionList
  } = useSelectiveContextDispatchNumberList({
    contextKey: itemListKey,
    listenerKey: selectorListenerKey,
    initialValue: EmptyArray
  });

  const isPinned = selectionList.includes(itemId);

  const handlePinClick = () => {
    if (isPinned) {
      const numbers = selectionList.filter(
        (selectedId) => selectedId !== itemId
      );
      setSelectionList(numbers);
    } else {
      setSelectionList([...selectionList, itemId]);
    }
  };

  return (
    <Tooltip placement={'right'}>
      <TooltipTrigger>
        <div className="px-1 flex items-center h-full">
          <button onClick={handlePinClick} className={'hover:opacity-50'}>
            {isPinned ? (
              <StarIconFilled className={'w-5 h-5'}></StarIconFilled>
            ) : (
              <StarIconOutline className={'w-5 h-5'}></StarIconOutline>
            )}
          </button>
        </div>
      </TooltipTrigger>

      <StandardTooltipContent>
        Click to show {itemDescriptor} in main area.
      </StandardTooltipContent>
    </Tooltip>
  );
}
