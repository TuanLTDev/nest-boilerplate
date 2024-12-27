import { Global, Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtUtil } from '@core/utils/jwt.util';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventService } from '@core/events/event.service';

const providers: Provider[] = [JwtUtil, EventService];

@Global()
@Module({
  imports: [JwtModule.register({}), EventEmitterModule.forRoot()],
  providers,
  exports: providers,
})
export class CoreModule {}
