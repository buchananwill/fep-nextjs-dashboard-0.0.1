'use server';
import { ActionResponsePromise } from './actionResponse';
import { ProviderAvailabilityDto } from '../dtos/ProviderAvailabilityDtoSchema';
import { API_BASE_URL } from '../main';
import { getWithoutBody, putEntities } from './template-actions';

const teachersEndpoint = `${API_BASE_URL}/providers/teachers`;
export async function getAvailabilities(
  providerRoleId: number
): ActionResponsePromise<ProviderAvailabilityDto[]> {
  const url = `${teachersEndpoint}/${providerRoleId}/availability`;

  return await getWithoutBody<ProviderAvailabilityDto[]>(url);
}

const parseTime = (dateTime: Date) => {
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const seconds = dateTime.getSeconds();
  const toString = (timePart: number) => {
    return timePart > 9 ? timePart.toString() : '0' + timePart.toString();
  };
  return `${toString(hours)}:${toString(minutes)}:${toString(seconds)}`;
};

export async function updateAvailabilities(
  availabilities: Map<number, ProviderAvailabilityDto[]>
): ActionResponsePromise<ProviderAvailabilityDto[]> {
  let flatDtoList: ProviderAvailabilityDto[] = [];
  for (let value of availabilities.values()) {
    flatDtoList = [...flatDtoList, ...value];
  }

  const forwardingUrl = `${teachersEndpoint}/availabilities`;

  try {
    return putEntities(flatDtoList, forwardingUrl);
  } catch (error) {
    const errorMessage = `Error fetching data:  ${error}`;
    console.error('Error fetching data: ', error);
    return { status: 500, message: errorMessage };
  }
}

function makeMondayZero(day: number) {
  return (day + 6) % 7;
}

// This is the current hack for turning a local time within an availability unit to an epochal LocalDateTime.
function parseStringTimeToDate(time: string, date: Date): Date {
  const hours = parseInt(time.substring(0, 2));
  const minutes = parseInt(time.substring(3, 5));
  const seconds = parseInt(time.substring(6, 8));
  const response = new Date(date);
  response.setHours(hours, minutes, seconds);
  return response;
}
