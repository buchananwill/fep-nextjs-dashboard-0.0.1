import { Tooltip, TooltipTrigger } from '../tooltips/tooltip';
import { StandardTooltipContent } from '../tooltips/standard-tooltip-content';
import React from 'react';
import { FillableButton, PinIcons } from '../buttons/fillable-button';
import { useSelectiveContextDispatchNumberList } from '../selective-context/selective-context-manager-number-list';
import { EmptyNumberIdArray } from '../../premises/classroom-suitability/asset-suitability-table-wrapper';

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
    initialValue: EmptyNumberIdArray
  });

  const isPinned = selectionList.includes(itemId);

  const handlePinClick = () => {
    if (isPinned) {
      setSelectionList(
        selectionList.filter((selectedId) => selectedId !== itemId)
      );
    } else {
      setSelectionList([...selectionList, itemId]);
    }
  };

  return (
    <Tooltip placement={'right'}>
      <TooltipTrigger>
        <div
          className="px-1 flex items-center h-full"
          // style={{ borderColor: `${current.cssHSLA}` }}
        >
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
