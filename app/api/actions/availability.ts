import { ActionResponsePromise, successResponse } from './actionResponse';
import { ProviderAvailabilityDto } from '../dtos/ProviderAvailabilityDtoSchema';
import { API_BASE_URL } from '../main';
import { getWithoutBody } from './template-actions';

export async function getAvailabilities(
  mechanicId: number
): ActionResponsePromise<ProviderAvailability[]> {
  const url = `${API_BASE_URL}/providers/teachers/${mechanicId}/availability`;

  const response = await getWithoutBody<ProviderAvailabilityDto[]>(url);

  const availabilityDtoList: ProviderAvailabilityDto[] = response.data || [];
  const providerAvailabilities = availabilityDtoList.map(
    convertAvailabilityDto
  );
  return successResponse(providerAvailabilities);
}

const convertToDto = ({
  providerId,
  availabilityCode,
  cycleSubspan
}: ProviderAvailability): ProviderAvailabilityDto => {
  return {
    providerRoleId: providerId,
    availabilityCode: availabilityCode,
    cycleSubspanDto: {
      start: parseTime(cycleSubspan.timespan.start),
      end: parseTime(cycleSubspan.timespan.end),
      id: cycleSubspan.id,
      zeroIndexedCycleDay: cycleSubspan.zeroIndexedCycleDay
    }
  };
};
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
  availabilities: Map<number, ProviderAvailability[]>
): Promise<ActionResponse<ProviderAvailability[]>> {
  let flatDtoList: ProviderAvailabilityDto[] = [];
  for (let value of availabilities.values()) {
    const providerAvailabilityDtos = value.map(convertToDto);
    flatDtoList = [...flatDtoList, ...providerAvailabilityDtos];
  }

  const forwardingUrl = `${API_BASE_URL}/mechanics/availabilities`;

  try {
    const response = await fetch(forwardingUrl, {
      // next: { tags: [tag] }, // Next collection tag for revalidation handling.
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      // cache: cacheSetting, // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(availabilities) // body data type must match "Content-Type" header
    });

    if (!response.ok) {
      console.error(`Error fetching data: HTTP ${response.status}`);
      return { status: response.status, message: response.statusText };
    }

    const updatedAvailabilityDtos: ProviderAvailabilityDto[] =
      await response.json();
    const providerAvailabilities = updatedAvailabilityDtos.map(
      convertAvailabilityDto
    );

    return { status: response.status, data: providerAvailabilities };

    // revalidatePath("/electives/") // Update cached posts
    // redirect(redirectUrl) // Navigate to add route
  } catch (error) {
    const errorMessage = `Error fetching data:  ${error}`;
    console.error('Error fetching data: ', error);
    return { status: 500, message: errorMessage };
  }
}

const convertAvailabilityDto = ({
  cycleSubspanDto,
  availabilityCode,
  providerRoleId
}: ProviderAvailabilityDto): ProviderAvailability => {
  const cycleSubspan: CycleSubspan =
    convertDtoToAvailabilityUnit(cycleSubspanDto);
  return {
    availabilityCode: availabilityCode,
    providerId: providerRoleId,
    cycleSubspan: cycleSubspan
  };
};

function convertDtoToAvailabilityUnit(dto: CycleSubspanDto): CycleSubspan {
  const { start, end, id, zeroIndexedCycleDay } = dto;
  const today = new Date(Date.now());
  const todayOffset = makeMondayZero(today.getDay());
  const dayOffset = todayOffset - zeroIndexedCycleDay;
  const updatedDate = subDays(today, dayOffset);
  const startDateTime = parseStringTimeToDate(start, updatedDate);
  const endDateTime = parseStringTimeToDate(end, updatedDate);
  const dateNormalizedInterval = interval(startDateTime, endDateTime);
  return {
    timespan: dateNormalizedInterval,
    id: id,
    zeroIndexedCycleDay: zeroIndexedCycleDay
  };
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

interface CycleDto extends HasNumberId {
  cycleSubspans: CycleSubspanDto[];
  cycleLengthInDays: number;
  cycleDayZero: string;
}

export async function getAvailbilityUnits(): ActionResponsePromise<
  CycleSubspan[]
> {
  const workshopAvailabilityUrl = `${API_BASE_URL}/cycleSubspans`;
  const response = await fetch(workshopAvailabilityUrl, { cache: 'no-cache' });
  const cycleDto: CycleDto = await response.json();
  const cycleSubspans = cycleDto.cycleSubspans.map(
    convertDtoToAvailabilityUnit
  );
  return ActionResponse.success(cycleSubspans);
}
