import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import * as yamljs from 'yamljs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  const docDir = path.join(__dirname, '..', '/doc');
  if (!fs.existsSync(docDir)) {
    fs.mkdirSync(docDir);
  }
  fs.writeFileSync(
    path.join(docDir, 'new-api.json'),
    JSON.stringify(document, null, 2),
  );

  SwaggerModule.setup('doc', app, document);

  const yamlDocument: OpenAPIObject = yamljs.load('./doc/api.yaml');
  SwaggerModule.setup('api', app, yamlDocument);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger UI available at: http://localhost:${port}/doc`);
  console.log(
    `YAML-based Swagger UI available at: http://localhost:${port}/api`,
  );
}
bootstrap();
