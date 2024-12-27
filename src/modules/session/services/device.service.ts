import { Inject, Injectable } from '@nestjs/common';
import { DeviceRepositoryInterface } from '@modules/session/interfaces/device.repository.interface';
import { DeviceMetadata } from '@modules/auth/interfaces';
import { Device } from '@modules/session/entities/device.schema';

@Injectable()
export class DeviceService {
  constructor(
    @Inject('DeviceRepositoryInterface')
    private readonly deviceRepository: DeviceRepositoryInterface,
  ) {}

  async createOrUpdate(dto: DeviceMetadata) {
    const device: Partial<Device> = {
      _id: dto.id,
      headers: dto.headers,
      userAgent: dto.userAgent,
      ipAddress: dto.ipAddress.value,
    };

    return this.deviceRepository.findByIdAndUpdate(dto.id, device, {
      new: true,
      upsert: true,
      lean: true,
    });
  }
}
