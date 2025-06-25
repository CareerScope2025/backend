import { Injectable, NotFoundException } from '@nestjs/common';
import { UserPreferenceDto } from './dto/userPreference.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
import { UsersService } from '@src/modules/users/users.service';
@Injectable()
export class MainService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService
  ) {}

  async getMain() {
    return 'Main';
  }

  async setUserPreference(
    userPreferenceDto: UserPreferenceDto,
    userId: number
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: {
        userInfo: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const response = await axios.post('http://localhost:8000/preference', {
      salary: userPreferenceDto.salary,
      introduction: userPreferenceDto.introduction,
      traits: userPreferenceDto.traits,
      scale: userPreferenceDto.scale,
    });
    const response2 = await axios.post('http://localhost:8000/ability_match', {
      schoolName: user.userInfo.schoolName,
      gpa: user.userInfo.schoolScore,
      englishScores: user.userInfo.englishScores,
      certificationCount: user.userInfo.certificationCount,
      internshipCount: user.userInfo.internshipCount,
      clubActivityCount: user.userInfo.clubActivityCount,
      awardsCount: user.userInfo.awardsCount,
      experienceYears: user.userInfo.experienceYears,
    });
    console.log(response.data);
    console.log(response2.data);
    // jobs 배열로 필터링된 회사별 세부정보 반환
    return this.usersService.getMatchedCompanies(
      // 이제 첫번째가 similarity, 두번째가 score
      response2.data.top_matches,
      response.data.top_matches,
      userPreferenceDto.jobs,
      user.userInfo
    );
  }

  async generateReport(userId: number, userInfo: any, companyId: number) {
    const response = await axios.post(`http://localhost:8000/${companyId}`, {
      userId,
      userInfo,
    });
    return response.data;
  }

  async getCompany(companyId: number) {
    const company = await this.prismaService.company.findUnique({
      where: { id: companyId },
      include: {
        companyAbility: true,
        companyJobs: true,
      },
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return {
      companyId: company.id,
      companyName: company.name,
      companyGpa: company.companyAbility.gpa,
      companyCertification: company.companyAbility.certificationCnt,
      companyAwards: company.companyAbility.awardsCnt,
      companyInternship: company.companyAbility.internshipCnt,
      companyClubActivity: company.companyAbility.clubActivityCnt,
      companyEnglish: company.companyAbility.englishScores,
      companyJobs: company.companyJobs.map(job => ({
        jobId: job.id,
        jobName: job.jobName,
        jobSalary: job.salary,
        jobVision: job.vision,
      })),
    };
  }
}
