import { Injectable, NotFoundException } from '@nestjs/common';
import { UserPreferenceDto } from './dto/userPreference.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
@Injectable()
export class MainService {
  constructor(private readonly prismaService: PrismaService) {}

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
    const response = await axios.post(
      'http://localhost:8000/api/v1/user-preference',
      {
        userId,
        salary: userPreferenceDto.salary,
        introduction: userPreferenceDto.introduction,
        jobs: userPreferenceDto.jobs,
        traits: userPreferenceDto.traits,
        scale: userPreferenceDto.scale,
        schoolName: user.userInfo.schoolName,
        gpa: user.userInfo.schoolScore,
        englishScores: user.userInfo.englishScores,
        certificationCount: user.userInfo.certificationCount,
        internshipCount: user.userInfo.internshipCount,
        clubActivityCount: user.userInfo.clubActivityCount,
        awardsCount: user.userInfo.awardsCount,
        experienceYears: user.userInfo.experienceYears,
      }
    );
    return response.data;
  }

  async generateReport(userId: number, userInfo: any, companyId: number) {
    const response = await axios.post(
      `http://localhost:8000/api/v1/generate-report/${companyId}`,
      { userId, userInfo }
    );
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
      companyAddress: company.address,
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
        jobTask: job.task,
      })),
    };
  }
}
