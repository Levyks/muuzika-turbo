import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Environment } from 'database';
import {
  ConfigDto,
  CreateOrJoinRoomRequestDtoClass,
  zodCreateOrJoinRoomRequestDtoFactory,
} from 'muuzika-zod';
import { PrismaService } from '../prisma/prisma.service';
import { EnvironmentService } from './environment.service';
import { zodToOpenAPI } from 'nestjs-zod';
import { JestMockedFunction } from '../typings/jest';

describe('EnvironmentService', () => {
  let environmentService: EnvironmentService;

  const mockConfigService = () => ({
    get: jest.fn((key: string) => `${key}_VALUE`),
  });

  const mockPrismaService = () => ({
    environment: {
      findFirst: jest.fn() as JestMockedFunction<
        PrismaService['environment']['findFirst']
      >,
    },
  });

  const mockEnvironment = (): Environment => ({
    name: 'environment',
    roomCodeLength: 4,
    nicknameMinLength: 3,
    nicknameMaxLength: 10,
    minNumberOfRounds: 1,
    maxNumberOfRounds: 10,
    defaultNumberOfRounds: 5,
    maxNumberOfPlayers: 32,
    minRoundDuration: 5,
    maxRoundDuration: 30,
    defaultRoundDuration: 15,
  });

  let mockedConfigService: ReturnType<typeof mockConfigService>;
  let mockedPrismaService: ReturnType<typeof mockPrismaService>;

  beforeEach(async () => {
    mockedConfigService = mockConfigService();
    mockedPrismaService = mockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvironmentService, ConfigService, PrismaService],
    })
      .overrideProvider(ConfigService)
      .useValue(mockedConfigService)
      .overrideProvider(PrismaService)
      .useValue(mockedPrismaService)
      .compile();

    environmentService = module.get<EnvironmentService>(EnvironmentService);
  });

  it('should be defined', () => {
    expect(environmentService).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should be defined', () => {
      expect(environmentService.onModuleInit).toBeDefined();
    });

    it('should be a function', () => {
      expect(environmentService.onModuleInit).toBeInstanceOf(Function);
    });

    it('should call loadEnvironment and applyConfigToZod', async () => {
      const loadEnvironmentSpy = jest.spyOn(
        environmentService,
        'loadEnvironment',
      );
      const applyConfigToZodSpy = jest.spyOn(
        environmentService,
        'applyConfigToZod',
      );

      loadEnvironmentSpy.mockResolvedValue(undefined);
      applyConfigToZodSpy.mockReturnValue(undefined);

      await environmentService.onModuleInit();

      expect(mockedConfigService.get).toHaveBeenCalledTimes(1);
      expect(mockedConfigService.get).toHaveBeenCalledWith('NODE_ENV');

      expect(loadEnvironmentSpy).toHaveBeenCalledTimes(1);
      expect(loadEnvironmentSpy).toHaveBeenCalledWith('NODE_ENV_VALUE');

      expect(applyConfigToZodSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadEnvironment', () => {
    it('should call prismaService.environment.findFirst', async () => {
      const environment = mockEnvironment();

      mockedPrismaService.environment.findFirst.mockResolvedValue(
        mockEnvironment(),
      );

      await environmentService.loadEnvironment(environment.name);

      expect(mockedPrismaService.environment.findFirst).toHaveBeenCalledTimes(
        1,
      );
      expect(mockedPrismaService.environment.findFirst).toHaveBeenCalledWith({
        where: {
          name: environment.name,
        },
      });
    });

    it('should throw an error if the environment is not found', async () => {
      const environmentName = mockEnvironment().name;

      mockedPrismaService.environment.findFirst.mockResolvedValue(null);

      await expect(
        environmentService.loadEnvironment(environmentName),
      ).rejects.toThrow(`Environment "${environmentName}" not found`);
    });

    it('should set the current environment', async () => {
      const environment = mockEnvironment();

      mockedPrismaService.environment.findFirst.mockResolvedValue(environment);

      await environmentService.loadEnvironment(environment.name);

      expect(environmentService.current).toBe(environment);
    });
  });

  describe('applyConfigToZod', () => {
    let config: ConfigDto;

    beforeEach(() => {
      environmentService.current = mockEnvironment();
      config = environmentService.config;
      environmentService.applyConfigToZod();
    });

    it('should set the schema of CreateOrJoinRoomRequestDtoClass', () => {
      const expectedSchema = zodToOpenAPI(
        zodCreateOrJoinRoomRequestDtoFactory(config),
      );
      const actualSchema = zodToOpenAPI(CreateOrJoinRoomRequestDtoClass.schema);

      expect(actualSchema).toEqual(expectedSchema);
    });
  });
});
