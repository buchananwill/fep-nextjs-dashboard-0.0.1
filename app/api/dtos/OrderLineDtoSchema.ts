import { z } from 'zod';
export const OrderLineDtoSchema = z.object({
  cost: z.number(),
  uid: z.number(),
  itemId: z.number(),
  fullPrice: z.number(),
  price: z.number(),
  quantityOnOrder: z.number(),
  salesRepId: z.number(),
  taxable: z.number(),
  description: z.string(),
  quantityRTD: z.number(),
  lastUpdated: z.date(),
  comment: z.string(),
});
export type OrderLineDto = z.infer<typeof OrderLineDtoSchema>;