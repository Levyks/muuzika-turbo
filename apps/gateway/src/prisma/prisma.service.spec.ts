import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should be defined', () => {
      expect(service.onModuleInit).toBeDefined();
    });

    it('should be a function', () => {
      expect(service.onModuleInit).toBeInstanceOf(Function);
    });

    it('should call $connect', async () => {
      const connectSpy = jest.spyOn(service, '$connect');
      connectSpy.mockResolvedValue(undefined);

      const result = service.onModuleInit();
      expect(result).toBeInstanceOf(Promise);
      await result;

      expect(connectSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('enableShutdownHooks', () => {
    it('should be defined', () => {
      expect(service.enableShutdownHooks).toBeDefined();
    });

    it('should be a function', () => {
      expect(service.enableShutdownHooks).toBeInstanceOf(Function);
    });

    it('should call $on with correct callback', async () => {
      let callback: Function;
      const onSpy = jest.spyOn(service, '$on');
      onSpy.mockImplementation((_event, cb) => {
        callback = cb;
      });

      const mockedApp = {
        close: jest.fn(() => Promise.resolve()),
      } as unknown as INestApplication;

      const result = service.enableShutdownHooks(mockedApp);
      expect(result).toBeInstanceOf(Promise);
      await result;

      expect(onSpy).toHaveBeenCalledTimes(1);
      expect(onSpy).toHaveBeenCalledWith('beforeExit', expect.any(Function));

      expect(mockedApp.close).toHaveBeenCalledTimes(0);
      await callback();
      expect(mockedApp.close).toHaveBeenCalledTimes(1);
    });
  });
});
