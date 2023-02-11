import { z } from 'nestjs-zod/z';
import {
  zodNicknameFactory,
  zodNumberOfRoundsFactory,
  zodRoomCode,
  zodScore,
  zodRoundDurationFactory
} from './commons';
import { zodRoomRoundsType, zodRoomStatus } from './enums';
import type { ConfigDto } from './gateway/config.dtos';

export const zodPlayerDtoFactory = (config: ConfigDto) =>
  z.object({
    nickname: zodNicknameFactory(config),
    score: zodScore,
    connected: z.boolean()
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
    roundDuration: zodRoundDurationFactory(config)
  });

export type RoomDto = z.infer<ReturnType<typeof zodRoomDtoFactory>>;

export const serializableDate = z
  .dateString()
  .or(z.date())
  .transform((d) => (d instanceof Date ? d : new Date(d)));
