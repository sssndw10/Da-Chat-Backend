import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Message } from 'src/messages/message.schema';

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
  @Prop()
  name: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    default: [],
  })
  messages: Message[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
