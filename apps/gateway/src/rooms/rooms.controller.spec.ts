import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

describe('RoomsController', () => {
  let roomsController: RoomsController;
  let roomsService = {
    createRoom: async (nickname: string) => ({ code: '1234', url: 'foo' }),
    joinRoom: async (nickname: string, code: string) => ({ url: 'foo' }),
  } as RoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [RoomsService],
    })
      .overrideProvider(RoomsService)
      .useValue(roomsService)
      .compile();

    roomsService = module.get<RoomsService>(RoomsService);
    roomsController = module.get<RoomsController>(RoomsController);
  });

  it('should be defined', () => {
    expect(roomsController).toBeDefined();
  });

  it('createRoom endpoint should call service', async () => {
    const nickname = 'test';

    const spy = jest.spyOn(roomsService, 'createRoom');

    const result = await roomsController.createRoom({ nickname });

    expect(spy).toHaveBeenCalledWith(nickname);
    expect(result).toHaveProperty('code', '1234');
    expect(result).toHaveProperty('url', 'foo');
  });

  it('joinRoom endpoint should call service', async () => {
    const nickname = 'test';
    const code = '1234';

    const spy = jest.spyOn(roomsService, 'joinRoom');

    const result = await roomsController.joinRoom({ nickname }, code);

    expect(spy).toHaveBeenCalledWith(nickname, code);
    expect(result).toHaveProperty('url', 'foo');
  });
});
