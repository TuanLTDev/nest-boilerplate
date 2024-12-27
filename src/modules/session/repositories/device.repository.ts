import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Device, DeviceDocument } from '@modules/session/entities/device.schema';
import { DeviceRepositoryInterface } from '@modules/session/interfaces/device.repository.interface';
import { BaseRepositoryAbstract } from '@database/repositories/base/base.abstract.repository';

@Injectable()
export class DeviceRepository extends BaseRepositoryAbstract<DeviceDocument> implements DeviceRepositoryInterface {
  constructor(
    @InjectModel(Device.name)
    private readonly deviceModel: Model<DeviceDocument>,
  ) {
    super(deviceModel);
  }
}
