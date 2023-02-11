import { z } from 'nestjs-zod/z';
// Typescript is being weird here if we don't do a * import
import * as nestjsZodDto from 'nestjs-zod/dto';
import { zodNicknameFactory } from '../commons';
import { mockConfig, type ConfigDto } from './config.dtos';

export const zodCreateOrJoinRoomRequestDtoFactory = (config: ConfigDto) =>
  z.object({
    nickname: zodNicknameFactory(config)
  });

export class CreateOrJoinRoomRequestDtoClass extends nestjsZodDto.createZodDto(
  zodCreateOrJoinRoomRequestDtoFactory(mockConfig)
) {}
