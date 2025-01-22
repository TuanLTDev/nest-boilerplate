import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

export function setupSwagger(app: INestApplication): void {
  const configService = app.get<ConfigService>(ConfigService);
  const appName = configService.getOrThrow('app.name', { infer: true });
  const appUrl = configService.getOrThrow('app.url', { infer: true });
  const company: any = configService.getOrThrow('swagger', { infer: true });

  const documentBuilder = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(appName)
    .setContact(company.name, company.url, company.email)
    .addBearerAuth()
    .addServer(appUrl, 'Development');

  if (process.env.API_VERSION) {
    documentBuilder.setVersion(process.env.API_VERSION);
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
    deepScanRoutes: true,
  });

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: appName + ' Documentations',
    swaggerOptions: {
      explore: true,
      deepLinking: true,
      persistAuthorization: true,
    },
  });
}
