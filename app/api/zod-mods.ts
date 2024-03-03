import { z } from 'zod';
import { SimulationLinkDatum, SimulationNodeDatum } from 'd3';
import { isValid, parseISO } from 'date-fns';
import { DayOfWeek, REGEX_DATE, REGEX_TIME } from './date-and-time';
import { ProductComponentDtoSchema } from './dtos/ProductComponentDtoSchema';
import { ClosureDto, ClosureDtoSchema } from './dtos/ClosureDtoSchema';
import { ProductComponentStateDtoSchema } from './dtos/ProductComponentStateDtoSchema';
import { AssetDtoSchema } from './dtos/AssetDtoSchema';
import { HasUuidDtoSchema } from './dtos/HasUuidDtoSchema';
import { HasNameDtoSchema } from './dtos/HasNameDtoSchema';

const days = DayOfWeek;

export const zDateOnly = z
  .string()
  .regex(REGEX_DATE)
  .refine((arg) => (isValid(parseISO(arg)) ? arg : false));

export const zTimeOnly = z.string().regex(REGEX_TIME);

export const zDayOfWeek = z
  .string()
  .refine((arg) => Object.keys(days).includes(arg));

const LessonCycleSchema = z.object({
  periodVenueAssignments: z.map(z.number(), z.string()),
  enrolledStudentIds: z.set(z.number()),
  assignedTeacherIds: z.set(z.number()),
  requiredNumberOfPeriods: z.number(),
  subject: z.string(),
  ...HasNameDtoSchema.shape,
  ...HasUuidDtoSchema.shape
});

function makeGraphDtoSchema<T extends z.ZodTypeAny>(schema: T) {
  return z.object({
    nodes: z.array(schema),
    closureDtos: z.array(ClosureDtoSchema)
  });
}

export interface GraphDto<T> {
  nodes: DataNode<T>[];
  closureDtos: ClosureDto[];
}

function makeDataNodeSchema<T extends z.ZodSchema>(schema: T) {
  return z.object({
    id: z.number(),
    distanceFromRoot: z.number(),
    data: schema
  });
}

export type DataNode<T> = SimulationNodeDatum & {
  id: number;
  distanceFromRoot: number;
  data: T;
};
export type DataLink<T> = SimulationLinkDatum<DataNode<T>> & ClosureDto;

export const ProductComponentNodeSchema = makeDataNodeSchema(
  ProductComponentDtoSchema
);

const ProductComponentStateNodeSchema = makeDataNodeSchema(
  ProductComponentStateDtoSchema
);
const StateGraphDtoSchema = makeGraphDtoSchema(ProductComponentStateNodeSchema);

export const ProductComponentGraphSchema = makeGraphDtoSchema(
  ProductComponentNodeSchema
);

const AssetGraphDtoSchema = z.object({
  nodes: z.array(AssetDtoSchema),
  closureDtos: z.array(ClosureDtoSchema)
});

export type ProductComponentDtoGraph = z.infer<
  typeof ProductComponentGraphSchema
>;
export type AssetGraphDto = z.infer<typeof AssetGraphDtoSchema>;
export type StateGraphDto = z.infer<typeof StateGraphDtoSchema>;

export { LessonCycleSchema, AssetGraphDtoSchema };

export type LessonCycle = z.infer<typeof LessonCycleSchema>;
