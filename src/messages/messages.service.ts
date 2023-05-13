import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './message.schema';
import mongoose, { Model } from 'mongoose';
import { RoomsService } from 'src/rooms/rooms.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly roomsService: RoomsService,
  ) {}

  async createMessage(
    userId: string | mongoose.Types.ObjectId,
    body: string,
    roomId: string | mongoose.Types.ObjectId,
  ) {
    const message = await this.messageModel.create({
      user: userId,
      body,
      room: roomId,
    });

    console.log('Created message document:', message);

    const room = await this.roomsService.getRoomById(roomId);

    room.messages.push(message);

    room.save();

    return await message.save();
  }

  async getMessageById(id: string | mongoose.Types.ObjectId) {
    const result = await this.messageModel
      .findById(id)
      .lean()
      .populate('user')
      .exec();

    delete result.user.password;
    delete result.user.accessToken;
    delete result.user.refreshToken;

    return result;
  }

  async getAllMessages() {
    const result = await this.messageModel.find({}).populate('user');
  }
}
