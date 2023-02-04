import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { EnvironmentService } from './environment.service';

@Module({
  imports: [PrismaModule],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
