import { BaseEntity } from '@database/entities/base/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ActionList } from '@core/constants/app.constant';

export type PermissionDocument = mongoose.HydratedDocument<Permission>;

@Schema({ collection: 'Permissions', timestamps: true })
export class Permission extends BaseEntity {
  @Prop()
  name: string;

  @Prop({ required: true, length: 255 })
  resource: string;

  @Prop({ required: true })
  action: ActionList;

  @Prop()
  description: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
