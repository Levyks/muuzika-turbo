import { Injectable } from '@nestjs/common';
import { ServersService } from '../servers/servers.service';
import { PrismaService } from '../prisma/prisma.service';
import { Room, Server } from 'database';
import { EnvironmentService } from '../environment/environment.service';

@Injectable()
export class RoomsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly serversService: ServersService,
    private readonly environmentService: EnvironmentService,
  ) {}

  private async createRoomDbEntry(server: Server): Promise<string> {
    const sql = `SELECT * FROM create_room('${server.name}', ${this.environmentService.current.roomCodeLength}, 10000)`;
    return this.prismaService
      .$queryRawUnsafe<{ create_room: string }[]>(sql)
      .then((result) => result[0].create_room);
  }

  private async getRoom(
    code: string,
  ): Promise<(Room & { server: Server }) | null> {
    return this.prismaService.room.findFirst({
      where: {
        code,
      },
      include: {
        server: true,
      },
    });
  }

  async createRoom(nickname: string) {
    const server = await this.serversService.getLeastLoadedServer(
      this.environmentService.current.name,
    );

    if (server == null) {
      throw new Error('No server available');
    }

    const code = await this.createRoomDbEntry(server);

    return {
      code,
      url: server.url,
    };
  }

  async joinRoom(nickname: string, code: string) {
    const room = await this.getRoom(code);

    if (room == null) {
      throw new Error('Room not found');
    }

    return {
      room,
      code,
      url: room.server.url,
    };
  }
}
