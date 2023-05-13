import { Module } from '@nestjs/common';
import { Message, MessageSchema } from './message.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesService } from './messages.service';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [
    RoomsModule,
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
