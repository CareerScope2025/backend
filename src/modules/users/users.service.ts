import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SurveyDto } from './dto/survey.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  //   async survey(surveyDto: SurveyDto) {
  //     const user = await this.prismaService.user.create({
  //   }
}
