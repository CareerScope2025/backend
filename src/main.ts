import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Career Scope API')
    .setDescription('Career Scope을 위한 REST API 문서입니다.')
    .setVersion('1.0')
    .addBearerAuth() // JWT 인증 추가
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      url: '/api-docs', // Swagger 문서 경로와 맞추기 위해 설정
    },
    customSiteTitle: 'API 문서',
  });

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
