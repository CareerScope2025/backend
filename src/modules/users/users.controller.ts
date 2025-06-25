import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SurveyDto } from '@src/modules/users/dto/survey.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService
  ) {}

  @Post('survey')
  @UseGuards(AuthGuard('jwt'))
  async survey(@Body() surveyDto: SurveyDto, @GetUser() user: any) {
    return this.usersService.survey(surveyDto, user.userId);
  }
}
