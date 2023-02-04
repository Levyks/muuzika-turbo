import { Roles } from '@/auth/decorators/roles.decorators';
import { JwtAuthGuard } from '@/auth/guards';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Role } from 'database';
import {
  ServerWithAvailableCapacityDto,
  zodServerWithAvailableCapacityDto,
} from 'muuzika-zod';
import { ServersService } from './servers.service';

@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllServers(): Promise<ServerWithAvailableCapacityDto[]> {
    const servers = await this.serversService.getAllServers();
    return zodServerWithAvailableCapacityDto.array().parse(servers);
  }
}
