import { Card, Subtitle, Text, Title } from '@tremor/react';
import React from 'react';
import { ClassRoomDTO } from '../api/dto-interfaces';

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
