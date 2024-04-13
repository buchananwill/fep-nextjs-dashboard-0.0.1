'use client';
import { Text } from '@tremor/react';
import { Card, CardBody } from '@nextui-org/card';
import { WorkProjectSeriesSchemaDto } from '../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import React from 'react';
import { Tab } from '@headlessui/react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import { DeletedOverlay } from '../../generic/components/overlays/deleted-overlay';
import { TwoStageClick } from '../../generic/components/buttons/two-stage-click';
import { TabStyled } from '../../generic/components/tab-layouts/tab-styled';
import { TabPanelStyled } from '../../generic/components/tab-layouts/tab-panel-styled';
import { DtoComponentUiProps } from '../../playground/dto-component-wrapper';
import { useRenameEntity } from '../../playground/rename-entity';
import { isNotUndefined } from '../../api/main';
import { AdjustAllocation } from './adjust-allocation';
import { Button } from '@nextui-org/button';
import RenameModal from '../../generic/components/modals/rename-modal';

export function CurriculumDeliveryModel(
  props: DtoComponentUiProps<WorkProjectSeriesSchemaDto>
) {
  const {
    entity: model,
    deleted,
    dispatchWithoutControl,
    dispatchDeletion,
    entityClass
  } = props;

  const { openModal, ...renameModalProps } = useRenameEntity(
    entityClass,
    model,
    'curriculumDeliveryModel',
    dispatchWithoutControl
  );

  return (
    <Card className={'overflow-x-auto p-0'}>
      <CardBody>
        {isNotUndefined(dispatchDeletion) && (
          <DeletedOverlay
            show={deleted}
            handleUnDelete={() =>
              dispatchDeletion((state) => state.filter((id) => id != model.id))
            }
          />
        )}
        <Tab.Group>
          <div className={'grid grid-cols-4 mb-2 items-center gap-0.5'}>
            <div className={'col-span-2 flex items-center gap-1'}>
              {isNotUndefined(dispatchDeletion) && (
                <TwoStageClick
                  standardAppearance={'light'}
                  onPress={() =>
                    dispatchDeletion((state) => [...state, model.id])
                  }
                  isIconOnly
                >
                  {' '}
                  <TrashIcon className={'h-4 w-4'}></TrashIcon>
                </TwoStageClick>
              )}

              <Button
                onPress={openModal}
                size={'sm'}
                className={'px-unit-2'}
                // endContent={}
              >
                <span className={'text-left truncate ...'}>{model.name}</span>
                <PencilSquareIcon className={'h-full'} />
              </Button>
            </div>
            <Tab.List className={'grid col-span-2 grow grid-cols-2'}>
              <TabStyled>Periods</TabStyled>
              <TabStyled>Details</TabStyled>
            </Tab.List>
          </div>

          <TabPanelStyled>
            <AdjustAllocation {...props}></AdjustAllocation>
          </TabPanelStyled>
          <TabPanelStyled>
            <Text>{model.workTaskTypeId}</Text>
            <Text className="text-right">
              LessonTypeId{/*Todo: replace this with context-supplied value.*/}
            </Text>
          </TabPanelStyled>
        </Tab.Group>
      </CardBody>
      <RenameModal {...renameModalProps} />
    </Card>
  );
}
