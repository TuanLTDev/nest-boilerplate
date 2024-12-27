import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { hashPassword } from '@core/utils/password.util';
import { BaseEntity } from '@database/entities/base/base.entity';
import { GENDER } from '@core/constants/user.constant';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: 'Users' })
export class User extends BaseEntity {
  @Prop({ required: true, unique: true, maxLength: 255 })
  email: string;

  @Prop({ required: true, maxLength: 255 })
  password: string;

  @Prop({ default: true })
  emailConfirmed: boolean;

  @Prop({ default: 0 })
  accessFailedCount: number;

  @Prop({ maxLength: 30 })
  firstName: string;

  @Prop({ maxLength: 30 })
  lastName: string;

  @Prop({ maxLength: 30 })
  displayName: string;

  @Prop({ type: Number, enum: GENDER, default: GENDER.MALE })
  gender: number;

  @Prop({ type: Date })
  dateOfBirth: Date;

  @Prop({ maxLength: 255 })
  avatarUrl: string;

  @Prop({ maxLength: 255 })
  coverImageUrl: string;

  @Prop({
    unique: true,
    sparse: true,
    required: false,
    match: [/^\+?[0-9]\d{1,14}$/, 'Please fill a valid phone number'],
    nullable: true,
  })
  phoneNumber?: string;

  @Prop({ maxlength: 255 })
  address?: string;

  @Prop({ type: Boolean, default: false })
  lockoutEnabled: boolean;

  @Prop({ default: null })
  lockoutEnd?: Date;

  @Prop({ default: null })
  resetPasswordToken: string;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, index: false })
  role?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await hashPassword(this.password);
  next();
});
