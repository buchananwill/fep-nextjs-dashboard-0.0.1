import { ButtonTransformer } from '../components/list-disclosure-panel';
import { StudentDTO } from '../api/dto-interfaces';
import { Disclosure } from '@headlessui/react';
import React from 'react';

export const ButtonStudent: ButtonTransformer<StudentDTO> = ({
  data: { name }
}) => {
  return <span className="grow ml-2">{name}</span>;
};
