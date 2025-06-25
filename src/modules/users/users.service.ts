import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SurveyDto } from './dto/survey.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async survey(surveyDto: SurveyDto, userId: number) {
    const userInfo = await this.prismaService.userInfo.create({
      data: {
        userId,
        schoolName: surveyDto.schoolName,
        schoolScore: surveyDto.gpa,
        major: null,
        englishScores: surveyDto.englishScores,
        certificationCount: surveyDto.certificationCount,
        internshipCount: surveyDto.internshipCount,
        clubActivityCount: surveyDto.clubActivityCount,
        awardsCount: surveyDto.awardsCount,
        experienceYears: surveyDto.experienceYears,
      },
    });
    return userInfo;
  }

  async getUniqueJobs(): Promise<string[]> {
    const jobs = await this.prismaService.companyJob.findMany({
      select: { jobName: true },
      distinct: ['jobName'],
    });
    return jobs.map(j => j.jobName);
  }
}
