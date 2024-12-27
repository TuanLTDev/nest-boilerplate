import { BaseEntity } from '@database/entities/base/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Permission } from '@modules/permission/entities/permission.schema';

export type RoleDocument = mongoose.HydratedDocument<Role>;

@Schema({ timestamps: true, collection: 'Roles' })
export class Role extends BaseEntity {
  @Prop({ required: true, maxLength: 255 })
  name: string;

  @Prop({ maxLength: 255, default: null })
  description: string;

  @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: Permission.name }], default: [] })
  permissions: Array<string>;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
