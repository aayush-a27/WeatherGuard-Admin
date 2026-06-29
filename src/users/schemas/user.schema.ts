import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, enum: ['google', 'github'] })
  provider!: 'google' | 'github';

  @Prop({ required: true, enum: ['admin', 'user'], default: 'user' })
  role!: 'admin' | 'user';

  @Prop({
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  accessStatus!: 'pending' | 'approved' | 'rejected';

  @Prop({ default: null })
  telegramChatId?: string;

  @Prop({ default: null })
  avatar?: string;

  @Prop({ default: null, trim: true })
  city?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Index for scheduler: approved users with telegram
UserSchema.index({ accessStatus: 1, telegramChatId: 1 });
