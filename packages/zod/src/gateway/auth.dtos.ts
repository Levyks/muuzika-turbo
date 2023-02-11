import { z } from 'nestjs-zod/z';
// Typescript is being weird here if we don't do a * import
import * as nestjsZodDto from 'nestjs-zod/dto';
import { Role } from 'database';
import { serializableDate } from '../dtos';

export const zodLoginDto = z.object({
  email: z.string().email(),
  password: z.string()
});

export class LoginDtoClass extends nestjsZodDto.createZodDto(zodLoginDto) {}

export const zodUserDto = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: serializableDate,
  updatedAt: serializableDate,
  roles: z.nativeEnum(Role).array()
});

export type UserDto = z.infer<typeof zodUserDto>;

export const zodLoginResponseDto = z.object({
  accessToken: z.string(),
  user: zodUserDto
});

export type LoginResponseDto = z.infer<typeof zodLoginResponseDto>;
