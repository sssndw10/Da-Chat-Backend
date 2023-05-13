import { Controller, Get, Param } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('/:id/messages')
  async getMessages(@Param('id') id: string) {
    const result = await this.roomsService.getMessagesByRoomId(id);

    console.log('GottenMesasge:', result);

    return result;
  }
}
