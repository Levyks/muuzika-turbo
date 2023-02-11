import { z } from 'nestjs-zod/z';
import type { ConfigDto } from './gateway/config.dtos';

export const zodRoomCode = z.string().nonempty().max(16).describe('room code');

export const zodScore = z.number().positive().describe('Score');

export const zodNicknameFactory = (config: ConfigDto) =>
  z.string().min(config.nickname.minLength).max(config.nickname.maxLength).describe('nickname');

export const zodNumberOfRoundsFactory = (config: ConfigDto) =>
  z
    .number()
    .min(config.numberOfRounds.min)
    .max(config.numberOfRounds.max)
    .describe('number of rounds per game');

export const zodRoundDurationFactory = (config: ConfigDto) =>
  z
    .number()
    .min(config.roundDuration.min)
    .max(config.roundDuration.max)
    .describe('round duration in seconds');
