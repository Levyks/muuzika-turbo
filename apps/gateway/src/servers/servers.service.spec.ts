import { Test, TestingModule } from '@nestjs/testing';
import { ServerWithAvailableCapacity } from 'database';
import { PrismaService } from '../prisma/prisma.service';
import { JestMockedFunction } from '../typings/jest';
import { ServersService } from './servers.service';

describe('ServersService', () => {
  let service: ServersService;

  const mockPrismaService = () => ({
    serverWithAvailableCapacity: {
      findFirst: jest.fn() as JestMockedFunction<
        PrismaService['serverWithAvailableCapacity']['findFirst']
      >,
      findMany: jest.fn() as JestMockedFunction<
        PrismaService['serverWithAvailableCapacity']['findMany']
      >,
    },
  });

  let mockedPrismaService: ReturnType<typeof mockPrismaService>;

  beforeEach(async () => {
    mockedPrismaService = mockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ServersService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockedPrismaService)
      .compile();

    service = module.get<ServersService>(ServersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLeastLoadedServer', () => {
    it('should be defined', () => {
      expect(service.getLeastLoadedServer).toBeDefined();
    });

    it('should be a function', () => {
      expect(service.getLeastLoadedServer).toBeInstanceOf(Function);
    });

    it('should return a server with available capacity', async () => {
      const environmentName = 'ENVIRONMENT';
      const server: ServerWithAvailableCapacity = {
        name: 'NAME',
        url: 'URL',
        secret: 'SECRET',
        environmentName,
        registeredAt: new Date(),
        lastSeenAt: new Date(),
        numberOfRooms: 30,
        capacity: 1000,
        availableCapacity: 970,
      };

      mockedPrismaService.serverWithAvailableCapacity.findFirst.mockResolvedValue(
        server,
      );

      const result = await service.getLeastLoadedServer(environmentName);

      expect(result).toEqual(server);

      expect(
        mockedPrismaService.serverWithAvailableCapacity.findFirst,
      ).toBeCalledTimes(1);
      expect(
        mockedPrismaService.serverWithAvailableCapacity.findFirst,
      ).toBeCalledWith({
        where: {
          environmentName,
          available: {
            gt: 0,
          },
        },
        orderBy: {
          available: 'desc',
        },
      });
    });
  });

  describe('getAllServers', () => {
    it('should be defined', () => {
      expect(service.getAllServers).toBeDefined();
    });

    it('should be a function', () => {
      expect(service.getAllServers).toBeInstanceOf(Function);
    });

    it('should return all servers', async () => {
      const servers: ServerWithAvailableCapacity[] = Array.from(
        { length: 10 },
        (_, i) => ({
          name: `NAME${i}`,
          url: `URL${i}`,
          secret: `SECRET${i}`,
          environmentName: `ENVIRONMENT${i}`,
          registeredAt: new Date(),
          lastSeenAt: new Date(),
          numberOfRooms: 30,
          capacity: 1000,
          availableCapacity: 970,
        }),
      );

      mockedPrismaService.serverWithAvailableCapacity.findMany.mockResolvedValue(
        servers,
      );

      const result = await service.getAllServers();

      expect(result).toEqual(servers);

      expect(
        mockedPrismaService.serverWithAvailableCapacity.findMany,
      ).toBeCalledTimes(1);
      expect(
        mockedPrismaService.serverWithAvailableCapacity.findMany,
      ).toBeCalledWith({
        orderBy: {
          name: 'asc',
        },
      });
    });
  });
});
