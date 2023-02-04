import { z } from 'nestjs-zod/z';

export const zodConfigDto = z.object({
  nickname: z.object({
    minLength: z.number().int().positive(),
    maxLength: z.number().int().positive()
  }),
  numberOfRounds: z.object({
    min: z.number().int().positive(),
    max: z.number().int().positive()
  }),
  roundDuration: z.object({
    min: z.number().int().positive(),
    max: z.number().int().positive()
  })
});

export type ConfigDto = z.infer<typeof zodConfigDto>;

export const mockConfig: ConfigDto = {
  nickname: {
    minLength: 0,
    maxLength: 0
  },
  numberOfRounds: {
    min: 0,
    max: 0
  },
  roundDuration: {
    min: 0,
    max: 0
  }
};
