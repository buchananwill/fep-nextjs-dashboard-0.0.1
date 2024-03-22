import { API_BASE_URL } from '../main';
import { EventDto } from '../dtos/EventDtoSchema';
import { getWithoutBody, patchEntity } from './template-actions';
import { ActionResponsePromise } from './actionResponse';

export async function getCalendarEvents(partyId: number) {
  const url = `${API_BASE_URL}/events?partyId=${partyId}`;
  return getWithoutBody(url);
}

export async function patchEvent(
  eventDto: EventDto
): ActionResponsePromise<EventDto> {
  const url = `${API_BASE_URL}/events`;
  return patchEntity(eventDto, url);
}

export async function patchEvents(calendarEvents: EventDto[]) {
  try {
    return await Promise.all(calendarEvents.map(patchEvent));
  } catch (e) {
    console.log(e);
  }
}
