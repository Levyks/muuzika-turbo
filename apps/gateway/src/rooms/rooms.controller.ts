import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateOrJoinRoomRequestDtoClass } from 'muuzika-zod';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async createRoom(@Body() payload: CreateOrJoinRoomRequestDtoClass) {
    return this.roomsService.createRoom(payload.nickname);
  }

  @Post(':code')
  joinRoom(@Body() payload: CreateOrJoinRoomRequestDtoClass, code: string) {
    return this.roomsService.joinRoom(payload.nickname, code);
  }
}
