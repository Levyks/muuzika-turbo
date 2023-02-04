import { z } from 'nestjs-zod/z';
import { serializableDate } from '../dtos';

export const zodServerDto = z.object({
  name: z.string(),
  registeredAt: serializableDate,
  lastSeenAt: serializableDate,
  environmentName: z.string(),
  url: z.string(),
  capacity: z.number()
});

export type ServerDto = z.infer<typeof zodServerDto>;

export const zodServerWithAvailableCapacityDto = zodServerDto.extend({
  numberOfRooms: z.number(),
  availableCapacity: z.number()
});

export type ServerWithAvailableCapacityDto = z.infer<typeof zodServerWithAvailableCapacityDto>;
