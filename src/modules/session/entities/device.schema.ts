import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '@database/entities/base/base.entity';

export type DeviceDocument = HydratedDocument<Device>;

@Schema({ timestamps: true, collection: 'Devices' })
export class Device extends BaseEntity {
  @Prop({ required: true, primaryKey: true, type: String })
  _id: string;

  @Prop({ type: Object })
  headers: object;

  @Prop({ type: Object })
  userAgent: object;

  @Prop({ type: String })
  ipAddress: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
