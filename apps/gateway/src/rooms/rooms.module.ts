import { EnvironmentModule } from '@/environment/environment.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ServersModule } from '@/servers/servers.module';
import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [PrismaModule, ServersModule, EnvironmentModule],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
