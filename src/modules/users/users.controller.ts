import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SurveyDto } from '@src/modules/users/dto/survey.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService
  ) {}

//   @Post('survey')
//   async survey(@Body() surveyDto: SurveyDto) {
//     return this.usersService.survey(surveyDto);
//   }
}
