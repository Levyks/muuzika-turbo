import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    origin: '*',
  });

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const configService = app.get(ConfigService);
  const cookieSecret = configService.get<string>('COOKIE_SECRET');

  app.register(fastifyCookie, {
    secret: cookieSecret,
  });

  await app.listen(process.env.PORT || 5000, '0.0.0.0');
}

bootstrap();
