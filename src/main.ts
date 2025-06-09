import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';
import * as Yaml from 'yamljs';
import { AppDataSource } from '../data-source';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const port = process.env.PORT || 4000;

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('Home Library Service')
      .setDescription('Home library service')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    const docDir = path.join(__dirname, '..', 'doc');
    if (!fs.existsSync(docDir)) {
      fs.mkdirSync(docDir);
    }
    fs.writeFileSync(
      path.join(docDir, 'new-api.json'),
      JSON.stringify(document, null, 2),
    );

    SwaggerModule.setup('doc', app, document);

    const swaggerDocument = Yaml.load(join(__dirname, '..', 'doc', 'api.yaml'));
    app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    await app.listen(port);

    console.log(`Application is running on: ${await app.getUrl()}`);
    console.log(`Swagger UI available at: http://localhost:${port}/doc`);
    console.log(
      `YAML-based Swagger UI available at: http://localhost:${port}/api`,
    );
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

bootstrap();
