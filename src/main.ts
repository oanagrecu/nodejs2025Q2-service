import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';
import * as Yaml from 'yamljs';
import { AppDataSource } from '../data-source';
import { LoggingService } from './logging/logging.service';
import { AllExceptionsFilter } from './logging/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggingService);

  const PORT = process.env.PORT || 4000;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter(logger));

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error.stack || error.message);
  });

  process.on('unhandledRejection', (reason: any) => {
    logger.error(
      'Unhandled Rejection:',
      reason?.stack || reason?.message || reason,
    );
  });

  try {
    await AppDataSource.initialize();
    logger.log('Database connected');

    const docDir = path.join(__dirname, '..', 'doc');
    if (!fs.existsSync(docDir)) fs.mkdirSync(docDir);

    const swaggerConfig = new DocumentBuilder()
      .setTitle('Home Library Service')
      .setDescription('Home library service API')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('/doc', app, swaggerDocument);

    fs.writeFileSync(
      path.join(docDir, 'new-api.json'),
      JSON.stringify(swaggerDocument, null, 2),
    );
    const yamlContent = Yaml.stringify(swaggerDocument, 10);
    fs.writeFileSync(path.join(docDir, 'api.yaml'), yamlContent);

    // Serve Swagger UI (YAML) from static file at /api
    const swaggerYamlDoc = Yaml.load(path.join(docDir, 'api.yaml'));
    app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerYamlDoc));

    await app.listen(PORT);

    logger.log(`Application is running on: ${await app.getUrl()}`);
    logger.log(`Swagger UI (JSON) available at: http://localhost:${PORT}/doc`);
    logger.log(`Swagger UI (YAML) available at: http://localhost:${PORT}/api`);
  } catch (error) {
    logger.error(
      'Failed to initialize database:',
      error.stack || error.message,
    );
    process.exit(1);
  }
}

bootstrap();
