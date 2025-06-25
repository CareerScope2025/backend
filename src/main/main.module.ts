import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  controllers: [MainController],
  providers: [MainService],
  imports: [PrismaModule],
})
export class MainModule {}
