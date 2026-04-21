import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {TransformInterceptor} from "./common/interceptors/transform/transform.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformInterceptor());
  const config = new DocumentBuilder()
    .setTitle('EVAS-TEL')
    .setDescription('EVAS-TEL TASK API')
    .setVersion('1.0.0')
    .addTag('EVAS-TEL')
    .build();
  const documentFactory = ()=> SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
