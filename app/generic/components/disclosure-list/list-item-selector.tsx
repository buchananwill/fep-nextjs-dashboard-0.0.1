'use client';
import React, { useEffect, useTransition } from 'react';
import { FillableButton, PinIcons } from '../buttons/fillable-button';
import { useSelectiveContextDispatchNumberList } from '../selective-context/selective-context-manager-number-list';
import { Tooltip, TooltipTrigger } from '../tooltips/tooltip';
import { StandardTooltipContent } from '../tooltips/standard-tooltip-content';
import { EmptyArray } from '../../../api/main';
import { PendingOverlay } from '../overlays/pending-overlay';

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
  const [pending, startTransition] = useTransition();

  const isPinned = selectionList.includes(itemId);

  const handlePinClick = () => {
    startTransition(() => {
      if (isPinned) {
        const numbers = selectionList.filter(
          (selectedId) => selectedId !== itemId
        );
        setSelectionList(numbers);
      } else {
        setSelectionList([...selectionList, itemId]);
      }
    });
  };

  return (
    <Tooltip placement={'right'}>
      <TooltipTrigger>
        <div
          className="px-1 flex items-center h-full"
          // style={{ borderColor: `${current.cssHSLA}` }}
        >
          <PendingOverlay pending={pending} />
          <FillableButton
            pinIcon={PinIcons.arrowLeftCircle}
            isPinned={isPinned}
            setPinned={handlePinClick}
            id={`${itemDescriptor}:${itemId}`}
          />
        </div>
      </TooltipTrigger>

      <StandardTooltipContent>
        Click to show {itemDescriptor} in main area.
      </StandardTooltipContent>
    </Tooltip>
  );
}
