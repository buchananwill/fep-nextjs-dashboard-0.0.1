import { z } from 'zod';
export const PartyIdBundleIdTupleSchema = z.object({
  partyId: z.number(),
  bundleId: z.number(),
});
export type PartyIdBundleIdTuple = z.infer<typeof PartyIdBundleIdTupleSchema>;