import { Card, Subtitle, Text, Title } from '@tremor/react';
import build from 'next/dist/build';
import React from 'react';

export interface ClassRoomDTO {
  assetUUID: string;
  name: string;
  floor: string;
  building: string;
}

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
