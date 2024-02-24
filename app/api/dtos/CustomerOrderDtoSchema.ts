import { OrderLineDtoSchema } from './OrderLineDtoSchema';
import { z } from 'zod';
export const CustomerOrderDtoSchema = z.object({
  uid: z.number(),
  clientRef: z.number(),
  closed: z.boolean(),
  dateCreated: z.date(),
  typeAsString: z.string(),
  type: z.number(),
  comment: z.string(),
  customerId: z.number(),
  shipToId: z.number(),
  deposit: z.number(),
  tax: z.number(),
  total: z.number(),
  lastUpdated: z.date(),
  dueDate: z.date(),
  taxable: z.boolean(),
  salesRepId: z.number(),
  referenceNumber: z.string(),
  shippingChargeOnOrder: z.number(),
  channelTypeAsString: z.string(),
  channelType: z.number(),
  checkedIn: z.boolean(),
  customerName: z.string(),
  orderLines: z.array(OrderLineDtoSchema),
  timeStamp: z.number(),
});
export type CustomerOrderDto = z.infer<typeof CustomerOrderDtoSchema>;