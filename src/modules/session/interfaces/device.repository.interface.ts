import { Device } from '@modules/session/entities/device.schema';
import { BaseRepositoryInterface } from '@database/repositories/base/base.interface.repository';

export interface DeviceRepositoryInterface extends BaseRepositoryInterface<Device> {}
