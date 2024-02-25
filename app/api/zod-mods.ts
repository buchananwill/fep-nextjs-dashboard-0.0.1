import { z } from 'zod';
import { SimulationLinkDatum, SimulationNodeDatum } from 'd3';
import { isValid, parseISO } from 'date-fns';
import { DayOfWeek, REGEX_DATE, REGEX_TIME } from './date-and-time';
import { ProductComponentDtoSchema } from './dtos/ProductComponentDtoSchema';
import { ClosureDto, ClosureDtoSchema } from './dtos/ClosureDtoSchema';
import { ProductComponentStateDtoSchema } from './dtos/ProductComponentStateDtoSchema';

const days = DayOfWeek;

export const zDateOnly = z
  .string()
  .regex(REGEX_DATE)
  .refine((arg) => (isValid(parseISO(arg)) ? arg : false));

export const zTimeOnly = z.string().regex(REGEX_TIME);

export const zDayOfWeek = z
  .string()
  .refine((arg) => Object.keys(days).includes(arg));

const NumberIdSchema = z.object({
  id: z.number()
});

const NameableSchema = z.object({
  name: z.string().min(1)
});

const UuidSchema = z.object({
  id: z.string().uuid()
});

const NameIdUuidTupleSchema = z.object({
  ...NameableSchema.shape,
  ...UuidSchema.shape
});

const NameIdNumberTupleSchema = z.object({
  ...NameableSchema.shape,
  ...NumberIdSchema.shape
});

const DescribableSchema = z.object({
  description: z.string().optional()
});

const ServiceCompetencySchema = z.object({
  ...NumberIdSchema.shape,
  competencyRating: z.number(),
  serviceProductType: z.string(),
  serviceProductTypeId: z.number()
});

// Define schema for ScheduleEventDto
const EventSchema = z.object({
  ...UuidSchema.shape,
  ...NameableSchema.shape,
  ...DescribableSchema.shape,
  eventStart: z.string(),
  eventEnd: z.string(),
  eventReasonId: z.number(),
  eventReasonType: z.string(),
  normalizedEventOutcome: z.number(),
  calendarId: z.string(),
  ownerRoleId: z.number()
});

export type DateFields = 'eventStart' | 'eventEnd';

export type EventDto = z.infer<typeof EventSchema>;

export type CalendarEvent = {
  [Property in keyof EventDto]: Property extends DateFields
    ? Date
    : EventDto[Property];
};

// Define schema for ServiceProductTypeDto
const ServiceProductTypeSchema = z.object({
  ...NumberIdSchema.shape,
  ...NameableSchema.shape,
  serviceCategoryName: z.string(),
  serviceCategoryId: z.number(),
  serviceCategoryKnowledgeDomainDescriptor: z.string(),
  knowledgeDomainName: z.string(),
  knowledgeDomainId: z.number(),
  serviceCategoryKnowledgeLevelDescriptor: z.string(),
  knowledgeLevelName: z.string(),
  knowledgeLevelLevelOrdinal: z.number(),
  knowledgeLevelId: z.number(),
  deliveryValidationTypeName: z.string(),
  deliveryValidationTypeId: z.number()
});

const DeliveryAllocationDtoSchema = z.object({
  deliveryAllocationSize: z.number(),
  count: z.number()
});

const KnowledgeDomainSchema = z.object({
  ...NameIdNumberTupleSchema.shape
});

const PartySchema = z.object({
  ...NumberIdSchema.shape,
  firstName: z.string(),
  lastName: z.string()
});
const MechanicDtoSchema = z.object({
  ...NameIdNumberTupleSchema.shape,
  knowledgeDomainId: z.number(),
  knowledgeDomainName: z.string(),
  partyId: z.number(),
  partyName: z.string(),
  serviceCompetencyDtoList: z.array(ServiceCompetencySchema)
});

const NewMechanicSchema = z.object({
  knowledgeDomain: KnowledgeDomainSchema,
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  partyId: z.number().optional()
});

const WorkTaskSchema = z.object({
  id: z.number(), // Use z.number().nullable() if it can be null, else just use z.number()
  events: z.array(EventSchema),
  dueDate: z.date(),
  workTaskTypeId: z.number(),
  workTaskTypeName: z.string(),
  serviceProductSeriesSchemaServiceProductType: ServiceProductTypeSchema,
  serviceProductSeriesSchemaDeliveryAllocations: z.array(
    DeliveryAllocationDtoSchema
  ),
  targetAssetId: z.number(),
  targetAssetName: z.string(),
  targetAssetAssetTypeName: z.string(),
  completedDate: z.date().nullable(), // Use .nullable() if the date can be null
  customerOrderNumber: z.number().nullable(), // Use .nullable() if it can be null
  notes: z.string().nullable() // Use .nullable() if it can be null
});

const LessonCycleSchema = z.object({
  periodVenueAssignments: z.map(z.number(), z.string()),
  enrolledStudentIds: z.set(z.number()),
  assignedTeacherIds: z.set(z.number()),
  requiredNumberOfPeriods: z.number(),
  subject: z.string(),
  ...NameableSchema.shape,
  ...UuidSchema.shape
});

type ID_TYPE = 'number' | 'string';

const ClosureSchema = z.object({
  depth: z.number(),
  id: z.number()
});

const NumberIdClosureSchema = z.object({
  ...ClosureSchema.shape,
  childId: z.number(),
  parentId: z.number()
});

export type NumberIdClosure = z.infer<typeof NumberIdClosureSchema>;

const StringIdClosureSchema = z.object({
  ...ClosureSchema.shape,
  childId: z.string(),
  parentId: z.string()
});

const AssetSchema = z.object({
  ...NumberIdSchema.shape,
  ...NameableSchema.shape,
  assetTypeId: z.number(),
  assetTypeName: z.string(),
  assetTypeIsMoveable: z.boolean(),
  ownerId: z.number(),
  distanceFromRoot: z.number()
});

z.object({
  field: z.boolean()
});

const ComponentTypeSchema = z.object({
  id: z.number(),
  typeCode: z.string(),
  name: z.string(),
  rootGraphId: z.number(),
  rootGraphName: z.string()
});

export type ComponentTypeDto = z.infer<typeof ComponentTypeSchema>;

// Type inference (optional)
export type AssetDto = z.infer<typeof AssetSchema>;

const AssetGraphDtoSchema = z.object({
  nodes: z.array(AssetSchema),
  closureDtos: z.array(NumberIdClosureSchema)
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

export const ProductComponentNodeSchema = makeDataNodeSchema(
  ProductComponentDtoSchema
);

const ProductComponentStateNodeSchema = makeDataNodeSchema(
  ProductComponentStateDtoSchema
);

export type ProductComponentNode = z.infer<typeof ProductComponentNodeSchema>;
export type ProductComponentStateNode = z.infer<
  typeof ProductComponentStateNodeSchema
>;

export type DataNode<T> = SimulationNodeDatum & {
  id: number;
  distanceFromRoot: number;
  data: T;
};

const StateGraphDtoSchema = makeGraphDtoSchema(ProductComponentStateNodeSchema);

export type DataLink<T> = SimulationLinkDatum<DataNode<T>> & ClosureDto;

export const ProductComponentGraphSchema = makeGraphDtoSchema(
  ProductComponentNodeSchema
);

export type ProductComponentDtoGraph = z.infer<
  typeof ProductComponentGraphSchema
>;
export type AssetGraphDto = z.infer<typeof AssetGraphDtoSchema>;
export type StateGraphDto = z.infer<typeof StateGraphDtoSchema>;

export {
  UuidSchema,
  NameableSchema,
  NameIdNumberTupleSchema,
  NameIdUuidTupleSchema,
  NumberIdSchema,
  DescribableSchema,
  MechanicDtoSchema,
  NewMechanicSchema,
  ServiceCompetencySchema,
  KnowledgeDomainSchema,
  PartySchema,
  EventSchema,
  ServiceProductTypeSchema,
  LessonCycleSchema,
  WorkTaskSchema,
  AssetSchema,
  AssetGraphDtoSchema,
  ClosureSchema,
  NumberIdClosureSchema,
  StringIdClosureSchema
};

export type HasNumberId = z.infer<typeof NumberIdSchema>;
export type HasUuid = z.infer<typeof UuidSchema>;
export type Nameable = z.infer<typeof NameableSchema>;
export type ServiceCompetencyDto = z.infer<typeof ServiceCompetencySchema>;
export type MechanicDto = z.infer<typeof MechanicDtoSchema>;
export type NewMechanicDto = z.infer<typeof NewMechanicSchema>;
export type Describable = z.infer<typeof DescribableSchema>;
export type NameIdUuidTuple = z.infer<typeof NameIdUuidTupleSchema>;
export type NameIdNumberTuple = z.infer<typeof NameIdNumberTupleSchema>;
export type KnowledgeDomain = z.infer<typeof KnowledgeDomainSchema>;

export type ServiceProductTypeDto = z.infer<typeof ServiceProductTypeSchema>;
export type Party = z.infer<typeof PartySchema>;
export type WorkTaskDto = z.infer<typeof WorkTaskSchema>;
export type LessonCycle = z.infer<typeof LessonCycleSchema>;
