import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MainService } from '@src/main/main.service';
import { UserPreferenceDto } from './dto/userPreference.dto';
import { GetUser } from '@src/modules/auth/decorators/get-user.decorator';

@Controller()
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Get()
  async getMain() {
    return this.mainService.getMain();
  }

  @Post('user-preference')
  async setUserPreference(
    @Body() userPreferenceDto: UserPreferenceDto,
    @GetUser() user: any
  ) {
    return this.mainService.setUserPreference(userPreferenceDto, user.userId);
  }

  @Get('generate-report/:companyId')
  async generateReport(
    @GetUser() user: any,
    @Param('companyId') companyId: number
  ) {
    return this.mainService.generateReport(
      user.userId,
      user.userInfo,
      companyId
    );
  }

  @Get(':companyId')
  async getCompany(@Param('companyId') companyId: number) {
    return this.mainService.getCompany(companyId);
  }
}
