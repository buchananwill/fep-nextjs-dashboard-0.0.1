import { Card, Subtitle, Text, Title } from '@tremor/react';
import React from 'react';
import { ClassRoomDTO } from '../api/dto-interfaces';

// TODO Add a prop for the decoration, and extract a color-coding schema in the parent component.

const ClassRoomCard = ({ classRoomDTO }: { classRoomDTO: ClassRoomDTO }) => {
  const { name, building, floor } = classRoomDTO;
  return (
    <Card decoration="top" decorationColor="emerald">
      <Title>{name}</Title>
      <Subtitle>{building}</Subtitle>
      <Text>{floor}</Text>
    </Card>
  );
};

export default ClassRoomCard;
