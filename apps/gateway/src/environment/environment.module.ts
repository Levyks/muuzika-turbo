import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EnvironmentService } from './environment.service';

@Module({
  imports: [PrismaModule],
  providers: [EnvironmentService],
})
export class EnvironmentModule {}
