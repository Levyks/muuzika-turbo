import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from 'database';
import {
  ConfigDto,
  CreateOrJoinRoomRequestDtoClass,
  zodCreateOrJoinRoomRequestDtoFactory,
} from 'muuzika-zod';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnvironmentService implements OnModuleInit {
  public current: Environment;

  public get config(): ConfigDto {
    return {
      nickname: {
        minLength: this.current.nicknameMinLength,
        maxLength: this.current.nicknameMaxLength,
      },
      numberOfRounds: {
        min: this.current.minNumberOfRounds,
        max: this.current.maxNumberOfRounds,
      },
      roundDuration: {
        min: this.current.minRoundDuration,
        max: this.current.maxRoundDuration,
      },
    };
  }

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const environmentName = this.configService.get<string>('NODE_ENV');
    await this.loadEnvironment(environmentName);
    this.applyConfigToZod();
  }

  async loadEnvironment(name: string): Promise<void> {
    const environment = await this.prismaService.environment.findFirst({
      where: { name },
    });

    if (environment == null) throw new Error(`Environment "${name}" not found`);

    this.current = environment;
  }

  applyConfigToZod(): void {
    const config = this.config;

    CreateOrJoinRoomRequestDtoClass.schema =
      zodCreateOrJoinRoomRequestDtoFactory(config);
  }
}
