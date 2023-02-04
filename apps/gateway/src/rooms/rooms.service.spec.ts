import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentService } from '../environment/environment.service';
import { ServersService } from '../servers/servers.service';
import { PrismaService } from '../prisma/prisma.service';
import { JestMockedFunction } from '../typings/jest';
import { RoomsService } from './rooms.service';

describe('RoomsService', () => {
  let roomsService: RoomsService;

  const mockPrismaService = () => ({
    environment: {
      findFirst: jest.fn() as JestMockedFunction<
        PrismaService['environment']['findFirst']
      >,
    },
    $queryRawUnsafe: jest.fn() as JestMockedFunction<
      PrismaService['$queryRawUnsafe']
    >,
  });

  const mockEnvironmentService = () => ({
    current: {
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
    },
  });

  const mockServersService = () => ({
    getLeastLoadedServer: jest.fn() as JestMockedFunction<
      ServersService['getLeastLoadedServer']
    >,
  });

  let mockedPrismaService: ReturnType<typeof mockPrismaService>;
  let mockedEnvironmentService: ReturnType<typeof mockEnvironmentService>;
  let mockedServersService: ReturnType<typeof mockServersService>;

  beforeEach(async () => {
    mockedPrismaService = mockPrismaService();
    mockedEnvironmentService = mockEnvironmentService();
    mockedServersService = mockServersService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        PrismaService,
        ServersService,
        EnvironmentService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockedPrismaService)
      .overrideProvider(EnvironmentService)
      .useValue(mockedEnvironmentService)
      .overrideProvider(ServersService)
      .useValue(mockedServersService)
      .compile();

    roomsService = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(roomsService).toBeDefined();
  });

  describe('createRoom', () => {
    it('should be defined', () => {
      expect(roomsService.createRoom).toBeDefined();
    });

    it('should be a function', () => {
      expect(roomsService.createRoom).toBeInstanceOf(Function);
    });

    it('should create a room', async () => {
      const nickname = 'NICKNAME';
      const serverName = 'SERVER_NAME';
      const serverUrl = 'SERVER_URL';
      const roomCode = 'ROOM_CODE';

      mockedServersService.getLeastLoadedServer.mockResolvedValue({
        name: serverName,
        registeredAt: new Date(),
        lastSeenAt: new Date(),
        environmentName: mockedEnvironmentService.current.name,
        url: serverUrl,
        capacity: 1000,
        rooms: 30,
        available: 970,
      });

      mockedPrismaService.$queryRawUnsafe.mockResolvedValue([
        {
          create_room: roomCode,
        },
      ]);

      const result = await roomsService.createRoom(nickname);

      expect(result).toEqual({
        code: roomCode,
        url: serverUrl,
      });

      expect(mockedServersService.getLeastLoadedServer).toHaveBeenCalledTimes(
        1,
      );
      expect(mockedServersService.getLeastLoadedServer).toHaveBeenCalledWith(
        mockedEnvironmentService.current.name,
      );

      expect(mockedPrismaService.$queryRawUnsafe).toHaveBeenCalledTimes(1);
      expect(mockedPrismaService.$queryRawUnsafe).toHaveBeenCalledWith(
        `SELECT * FROM create_room('${serverName}', ${mockedEnvironmentService.current.roomCodeLength}, 10000)`,
      );
    });

    it('should throw an error if no server is available', async () => {
      const nickname = 'NICKNAME';
      mockedServersService.getLeastLoadedServer.mockResolvedValue(null);

      await expect(roomsService.createRoom(nickname)).rejects.toThrow(
        'No server available',
      );
    });
  });
});
