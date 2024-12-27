import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@modules/user/entities/user.schema';
import { Device } from '@modules/session/entities/device.schema';
import { BaseEntity } from '@database/entities/base/base.entity';
import * as mongoose from 'mongoose';

export type SessionDocument = mongoose.HydratedDocument<Session>;

@Schema({ timestamps: true, collection: 'Sessions' })
export class Session extends BaseEntity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: string;

  @Prop({ type: String, ref: Device.name })
  deviceId: string;

  @Prop({ required: true, type: String })
  publicKey: string;

  @Prop({ required: true, type: String })
  privateKey: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
