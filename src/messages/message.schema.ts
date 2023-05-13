import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Room } from 'src/rooms/room.schema';
import { User } from 'src/users/user.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  room: Room;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
