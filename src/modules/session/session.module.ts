import { Module } from '@nestjs/common';
import { SessionService } from './services/session.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from '@modules/session/entities/session.schema';
import { SessionRepository } from '@modules/session/repositories/session.repository';
import { DeviceService } from '@modules/session/services/device.service';
import { DeviceRepository } from '@modules/session/repositories/device.repository';
import { Device, DeviceSchema } from '@modules/session/entities/device.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      {
        name: Device.name,
        schema: DeviceSchema,
      },
    ]),
  ],
  providers: [
    SessionService,
    {
      provide: 'SessionRepositoryInterface',
      useClass: SessionRepository,
    },
    DeviceService,
    {
      provide: 'DeviceRepositoryInterface',
      useClass: DeviceRepository,
    },
  ],
  exports: [SessionService, DeviceService],
})
export class SessionModule {}
