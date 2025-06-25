import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { S3Module } from './modules/s3/s3.module';

@Module({
  imports: [PrismaModule, AuthModule, S3Module],
  controllers: [AppController],
})
export class AppModule {}
