import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  [x: string]: any;
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  accessToken?: string;

  @Prop({ default: null })
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
