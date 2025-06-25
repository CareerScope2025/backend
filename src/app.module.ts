import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { S3Module } from './modules/s3/s3.module';
import { UsersModule } from './modules/users/users.module';
import { MainModule } from './main/main.module';

@Module({
  imports: [PrismaModule, AuthModule, S3Module, UsersModule, MainModule],
  controllers: [AppController],
})
export class AppModule {}
