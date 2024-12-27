import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

const getMongodbUri = (configService: ConfigService): MongooseModuleOptions => {
  const { scheme, host, username, password, port, databaseName, options } = configService.get('database');
  const auth = username && password ? `${username}:${password}@` : '';
  const portPart = scheme !== 'mongodb+srv' && port ? `:${port}` : '';
  const optionsPart = options ? options : '';

  const uri = `${scheme}://${auth}${host}${portPart}/${databaseName ?? ''}${optionsPart}`;
  return {
    uri,
  };
};

export const DatabaseConfigModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: getMongodbUri,
  inject: [ConfigService],
});
