import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { RoleModule } from '@modules/role/role.module';
import { commands } from '@/commands';
import { PermissionModule } from '@modules/permission/permission.module';
import { SessionModule } from '@modules/session/session.module';
import generateModulesSet from '@core/utils/modules-set';

const modulesGenerate = generateModulesSet();

@Module({
  imports: [...modulesGenerate, AuthModule, UserModule, RoleModule, PermissionModule, SessionModule],
  controllers: [AppController],
  providers: [AppService, ...commands],
})
export class AppModule {}
