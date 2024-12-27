import { CommandFactory } from 'nest-commander';
import { AppModule } from '@/app.module';
import * as process from 'node:process';

async function bootstrap() {
  await CommandFactory.run(AppModule, ['warn', 'error']);
}

bootstrap()
  .then(async (app) => {
    console.info('command bootstrapped ...!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('server failed to start command', err);
    process.exit(1);
  })
  .finally(() => {
    return process.exit(1);
  });
