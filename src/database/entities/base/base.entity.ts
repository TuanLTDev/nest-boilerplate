import { Prop } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';

export class BaseEntity {
  _id?: string;

  @Expose()
  @Transform((value) => value.obj?._id?.toString(), { toClassOnly: true })
  id?: string;

  @Prop({ default: null })
  deletedAt?: Date;
}
