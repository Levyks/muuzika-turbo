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
        availableCapacity: {
          gt: 0,
        },
      },
      orderBy: {
        availableCapacity: 'desc',
      },
    });
  }

  async getAllServers(): Promise<ServerWithAvailableCapacity[]> {
    return this.prisma.serverWithAvailableCapacity.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}
