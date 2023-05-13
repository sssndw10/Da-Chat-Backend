import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import constants from 'src/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getUserById(id: string | mongoose.Types.ObjectId) {
    return await this.userModel.findById(id).exec();
  }

  async getUserByName(username: string) {
    return await this.userModel
      .findOne({
        username,
      })
      .exec();
  }

  async createUser(username: string, password: string) {
    const encryptedPassword = await bcrypt.hash(password, constants.salt);

    return await this.userModel.create({
      username,
      password: encryptedPassword,
    });
  }

  async updateUserByName(
    username: string,
    updateQuery:
      | mongoose.UpdateWithAggregationPipeline
      | mongoose.UpdateQuery<
          // eslint-disable-next-line @typescript-eslint/ban-types
          mongoose.Document<unknown, {}, User> &
            Omit<User & { _id: mongoose.Types.ObjectId }, never>
        >,
  ) {
    const result = await this.userModel
      .updateOne(
        {
          username,
        },
        updateQuery,
      )
      .exec();

    return result;
  }
}
