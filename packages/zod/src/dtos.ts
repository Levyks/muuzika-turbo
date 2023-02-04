import { z } from 'nestjs-zod/z';
import {
  zodNicknameFactory,
  zodNumberOfRoundsFactory,
  zodRoomCode,
  zodScore,
  zodRoundDurationFactory,
} from './commons';
import { zodRoomRoundsType, zodRoomStatus } from './enums';
import { createZodDto } from 'nestjs-zod/dto';

export const zodPlayerDtoFactory = (config: ConfigDto) =>
  z.object({
    nickname: zodNicknameFactory(config),
    score: zodScore,
    connected: z.boolean(),
  });

export type PlayerDto = z.infer<ReturnType<typeof zodPlayerDtoFactory>>;

export const zodRoomDtoFactory = (config: ConfigDto) =>
  z.object({
    code: zodRoomCode,
    players: zodPlayerDtoFactory(config).array(),
    leader: zodNicknameFactory(config),
    status: zodRoomStatus,
    roundsType: zodRoomRoundsType,
    numberOfRounds: zodNumberOfRoundsFactory(config),
    roundDuration: zodRoundDurationFactory(config),
  });

export type RoomDto = z.infer<ReturnType<typeof zodRoomDtoFactory>>;
export const zodCreateOrJoinRoomRequestDtoFactory = (config: ConfigDto) =>
  z.object({
    nickname: zodNicknameFactory(config),
  });

export const zodConfigDto = z.object({
  nickname: z.object({
    minLength: z.number().int().positive(),
    maxLength: z.number().int().positive(),
  }),
  numberOfRounds: z.object({
    min: z.number().int().positive(),
    max: z.number().int().positive(),
  }),
  roundDuration: z.object({
    min: z.number().int().positive(),
    max: z.number().int().positive(),
  }),
});

const mockConfig: ConfigDto = {
  nickname: {
    minLength: 0,
    maxLength: 0,
  },
  numberOfRounds: {
    min: 0,
    max: 0,
  },
  roundDuration: {
    min: 0,
    max: 0,
  },
};

export type ConfigDto = z.infer<typeof zodConfigDto>;

export class CreateOrJoinRoomRequestDtoClass extends createZodDto(
  zodCreateOrJoinRoomRequestDtoFactory(mockConfig),
) {}
