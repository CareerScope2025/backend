import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '@src/modules/users/users.module';
@Module({
  controllers: [MainController],
  providers: [MainService],
  imports: [PrismaModule, UsersModule],
})
export class MainModule {}
