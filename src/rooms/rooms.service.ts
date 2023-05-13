import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Room, RoomDocument } from './room.schema';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>,
  ) {}

  async createRoom(name: string) {
    return await this.roomModel.create({
      name,
    });
  }

  async getRoomById(id: string | mongoose.Types.ObjectId) {
    return await this.roomModel.findById(id).exec();
  }

  async getRoomByName(name: string) {
    return await this.roomModel
      .findOne({
        name,
      })
      .exec();
  }

  async getMessagesByRoomId(roomId: string) {
    return (
      await this.roomModel
        .findById(roomId)
        .populate({
          path: 'messages',
          populate: {
            path: 'user',
            select: '-password -accessToken -refreshToken',
          },
        })
        .exec()
    ).messages;
  }
}
