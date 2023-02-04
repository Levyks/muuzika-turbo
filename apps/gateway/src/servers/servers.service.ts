import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Server, ServerWithAvailableCapacity } from 'database';

@Injectable()
export class ServersService {
  constructor(private prisma: PrismaService) {}

  async getLeastLoadedServer(
    environment: string,
  ): Promise<ServerWithAvailableCapacity | null> {
    return this.prisma.serverWithAvailableCapacity.findFirst({
      where: {
        environmentName: environment,
        available: {
          gt: 0,
        },
      },
      orderBy: {
        available: 'desc',
      },
    });
  }
}
