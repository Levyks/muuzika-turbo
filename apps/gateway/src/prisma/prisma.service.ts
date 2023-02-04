import {
  ConsoleLogger,
  INestApplication,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private static loggerContext = 'PrismaService';

  constructor(private readonly logger: ConsoleLogger) {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });
  }

  registerLogEvents() {
    const thisLogger = this as PrismaClient<{}, 'info' | 'warn' | 'error'>;

    thisLogger.$on('info', (e) => {
      this.logger.log(e.message, PrismaService.loggerContext);
    });

    thisLogger.$on('warn', (e) => {
      this.logger.warn(e.message, PrismaService.loggerContext);
    });

    thisLogger.$on('error', (e) => {
      this.logger.error(e.message, PrismaService.loggerContext);
    });
  }

  async onModuleInit() {
    this.registerLogEvents();
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async getDatabaseNow(): Promise<Date> {
    const result: [{ now: Date }] = await this.$queryRaw`SELECT NOW()`;
    return result[0].now;
  }
}
