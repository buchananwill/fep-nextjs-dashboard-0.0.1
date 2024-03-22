'use client';
import TransactionModal from '../../components/transactional-modal/transaction-modal';
import { useContext, useEffect, useState, useTransition } from 'react';
import { Textarea } from '@tremor/react';
import { ColorContextButton } from './color-context-button';
import RunnableContextProvider from './runnable-context-provider';
import { ProviderContext } from '../contexts/mechanics/provider-context';
import { format } from 'date-fns';
import { CalendarEvent, WorkTaskDto } from '../../api/zod-mods';
import { enableMapSet, produce } from 'immer';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../../components/tooltips/tooltip';
import { StandardTooltipContent } from '../../components/tooltips/standard-tooltip-content';
import {
  QuestionMarkCircleIcon,
  WrenchIcon
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/20/solid';
import { WorkshopTaskDispatchContext } from '../../contexts/workshop-task/workshop-task-context';
import { getWorkshopTask, patchWorkshopTask } from '../../actions/tasks';
import { ZoomScaleContext } from '../calendar-view/scale/zoom-scale-context';
import { DndContext, useDndContext } from '@dnd-kit/core';
import { DndMonitorContext } from '@dnd-kit/core/dist/components/DndMonitor';

function getIconSize(hourHeight: number): string {
  if (hourHeight < 70) return 'h-3 w-3';
  if (hourHeight < 90) return 'h-4 w-4';
  if (hourHeight < 110) return 'h-5 w-5';
  return 'h-6 w-6';
}

export default function WorkshopJobModal({
  workshopJob
}: {
  workshopJob: CalendarEvent;
}) {
  enableMapSet();
  const [open, setOpen] = useState(false);
  const {
    eventReasonId,
    eventReasonType,
    id,
    name,
    description,
    eventEnd,
    eventStart,
    ownerRoleId
  } = workshopJob;

  const [workshopTask, setWorkshopTask] = useState<WorkTaskDto | null>(null);
  const [notes, setNotes] = useState('');
  const [editedNotes, setEditedNotes] = useState('');
  const [edited, setEdited] = useState(false);
  const [pending, startTransition] = useTransition();
  const { providers } = useContext(ProviderContext);
  const { dispatch } = useContext(WorkshopTaskDispatchContext);
  const { y } = useContext(ZoomScaleContext);
  const { active } = useDndContext();

  useEffect(() => {
    const getTask = async () => {
      const task = await getWorkshopTask(eventReasonId);
      if (task) {
        setWorkshopTask(task);
        setNotes(task.notes || '');
      }
    };
    startTransition(() => getTask());
  }, [setNotes, eventReasonId, setWorkshopTask]);

  if (!workshopJob || pending) {
    return (
      <div className={'h-7 text-xs'}>
        Task loading.{' '}
        <span className={'loading loading-xs loading-spinner'}></span>
      </div>
    );
  }

  const iconSize = getIconSize(y);

  const mechanicName =
    providers.find((mech) => mech.id == ownerRoleId)?.partyName || '';

  const onClick = () => {
    if (!edited) {
      setEditedNotes(notes);
    }
    setOpen(true);
  };

  const handleCancel = () => {
    setEditedNotes(notes);
    setEdited(false);
    setOpen(false);
  };

  const handleConfirm = async () => {
    if (workshopTask) {
      const patchedTask: WorkTaskDto = await patchWorkshopTask({
        ...workshopTask,
        notes: editedNotes
      });
      setWorkshopTask(patchedTask);
      setNotes(patchedTask.notes || '');
      setEdited(false);
    }
    setOpen(false);
  };

  const toggleComplete = async () => {
    if (workshopTask) {
      let workshopTaskDto: WorkTaskDto | null = null;
      if (!workshopTask.completedDate) {
        workshopTaskDto = produce(workshopTask, (draft) => {
          draft.completedDate = new Date(Date.now());
        });
        dispatch({
          type: 'addEditedTask',
          editedTask: workshopTaskDto
        });
      } else {
        workshopTaskDto = produce(workshopTask, (draft) => {
          draft.completedDate = null;
        });
        dispatch({ type: 'addEditedTask', editedTask: workshopTaskDto });
      }
      setWorkshopTask(workshopTaskDto);
    }
  };

  return (
    <div
      className={
        'flex max-w-fit select-none z-10 mt-0.5 h-fit max-h-full overflow-hidden'
      }
    >
      <RunnableContextProvider context={{ callback: onClick }}>
        <Tooltip>
          <TooltipTrigger as={'div'} className={' max-h-fit h-fit'}>
            <ColorContextButton
              contextKey={mechanicName}
              className={'mr-1'}
              disabled={!!active}
            >
              <WrenchIcon className={`${iconSize} leading-[0px]`}></WrenchIcon>
            </ColorContextButton>
          </TooltipTrigger>

          <StandardTooltipContent>
            Click to view more info or <strong>edit</strong>.
          </StandardTooltipContent>
        </Tooltip>
      </RunnableContextProvider>
      <RunnableContextProvider context={{ callback: toggleComplete }}>
        <Tooltip>
          <TooltipTrigger>
            <ColorContextButton contextKey={mechanicName} disabled={!!active}>
              {workshopTask?.completedDate ? (
                <CheckIcon className={`${iconSize} leading-[0px]`}></CheckIcon>
              ) : (
                <QuestionMarkCircleIcon
                  className={`${iconSize} leading-[0px]`}
                ></QuestionMarkCircleIcon>
              )}
            </ColorContextButton>
          </TooltipTrigger>

          <StandardTooltipContent>
            Click to mark as <strong>completed</strong>.
          </StandardTooltipContent>
        </Tooltip>
      </RunnableContextProvider>

      <TransactionModal
        title={'Workshop Job'}
        context={{ open: open, confirm: handleConfirm, cancel: handleCancel }}
      >
        <div className=" divide-y flex  flex-col ">
          <p className="pt-2 text-sm">
            Job Id: <strong>{eventReasonId}</strong>
          </p>
          <p className="pt-2 text-sm">
            Name: <strong>{name}</strong>
          </p>
          <p className="pt-2 text-sm">
            Start: <strong>{format(eventStart, 'HH:MM')}</strong>
          </p>
          <p className="pt-2  text-sm">
            End: <strong>{format(eventEnd, 'HH:MM')}</strong>
          </p>
          <p className="pt-2  text-sm">
            Description: <strong>{description}</strong>
          </p>
          {workshopTask ? (
            <>
              <div className="py-2">Edit notes:</div>
              <Textarea
                value={editedNotes}
                onChange={(event) => {
                  setEditedNotes(event.target.value);
                  setEdited(true);
                }}
              ></Textarea>
              <div className={'text-gray-400 pt-2 text-sm'}>Asset Details:</div>
              {Object.entries(
                (({
                  targetAssetName,
                  targetAssetAssetTypeName
                }: WorkTaskDto) => ({
                  targetAssetName,
                  targetAssetAssetTypeName
                }))(workshopTask)
              ).map((entry) => (
                <div
                  key={`${workshopTask.id}-${entry[0]}`}
                  className={'pt-2 text-sm'}
                >
                  {entry[1] && <div> {entry[1].toString()}</div>}
                </div>
              ))}
            </>
          ) : (
            <div>Task not loaded...</div>
          )}
        </div>
      </TransactionModal>
    </div>
  );
}
