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

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', error.stack || error.message);
  });

  process.on('unhandledRejection', (reason: any) => {
    logger.error(
      'Unhandled Rejection',
      reason?.stack || reason?.message || reason,
    );
  });

  try {
    await AppDataSource.initialize();
    logger.log('Database connected');

    const port = process.env.PORT || 4000;

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalFilters(new AllExceptionsFilter(logger));

    const docDir = path.join(__dirname, '..', 'doc');
    if (!fs.existsSync(docDir)) {
      fs.mkdirSync(docDir);
    }

    // Swagger UI (JSON) at /doc — generated from decorators
    const config = new DocumentBuilder()
      .setTitle('Home Library Service')
      .setDescription('Home library service API')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('doc', app, document);

    // Save JSON and YAML to doc/
    fs.writeFileSync(
      path.join(docDir, 'new-api.json'),
      JSON.stringify(document, null, 2),
    );
    const yamlContent = Yaml.stringify(document, 10);
    fs.writeFileSync(path.join(docDir, 'api.yaml'), yamlContent);

    // Swagger UI (YAML) at /api — loaded from static file
    const swaggerYamlDoc = Yaml.load(path.join(docDir, 'api.yaml'));
    app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerYamlDoc));

    logger.log(`Application is running on: ${await app.getUrl()}`);
    logger.log(`Swagger UI (JSON) available at: http://localhost:${port}/doc`);
    logger.log(`Swagger UI (YAML) available at: http://localhost:${port}/api`);
  } catch (error) {
    logger.error(
      'Failed to initialize database:',
      error.stack || error.message,
    );
    process.exit(1);
  }

  await app.listen(process.env.PORT || 4000);
}

bootstrap();
