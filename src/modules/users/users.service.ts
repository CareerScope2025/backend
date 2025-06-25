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

  /**
   * 회사명(name)으로 Company 테이블에서 id를 찾아 반환
   */
  async getCompanyIdByName(companyName: string): Promise<number | null> {
    const company = await this.prismaService.company.findUnique({
      where: { name: companyName },
      select: { id: true },
    });
    return company ? company.id : null;
  }

  /**
   * 회사명-점수 매핑이 있을 때, companyId를 활용해 CompanyJob에서 jobName 등 세부정보를 조회
   */
  async getCompanyJobsWithScore(
    companyScoreList: { company: string; avgScore: number }[],
    jobs: string[]
  ) {
    // 회사명 → id 매핑
    const companies = await this.prismaService.company.findMany({
      where: { name: { in: companyScoreList.map(c => c.company) } },
      select: { id: true, name: true },
    });

    // CompanyJob에서 jobs 필터링
    const jobsData = await this.prismaService.companyJob.findMany({
      where: {
        companyId: { in: companies.map(c => c.id) },
        jobName: { in: jobs },
      },
      select: {
        companyId: true,
        jobName: true,
        salary: true,
        vision: true,
        task: true,
      },
    });

    // 결과 조합
    return jobsData.map(job => {
      const companyName = companies.find(c => c.id === job.companyId)?.name;
      const avgScore = companyScoreList.find(
        c => c.company === companyName
      )?.avgScore;
      return {
        companyId: job.companyId,
        companyName,
        avgScore,
        jobName: job.jobName,
        salary: job.salary,
        vision: job.vision,
        task: job.task,
      };
    });
  }

  /**
   * preference/ability-match 결과를 합쳐 평균 점수, companyId, jobName 필터, 세부정보 반환
   */
  async getMatchedCompanies(
    preferenceResult: { company: string; similarity: number }[],
    abilityResult: { company: string; score: number }[],
    jobs: string[],
    userInfo: any
  ) {
    // 1. 회사명 → companyId 매핑
    const companyList = await this.prismaService.company.findMany({
      select: { id: true, name: true },
    });
    const nameToId = new Map(companyList.map(c => [c.name, c.id]));

    // 2. 결과에 companyId 추가
    abilityResult.forEach(c => {
      if (!nameToId.has(c.company)) {
        console.warn(`DB에 없는 회사명(abilityResult): "${c.company}"`);
      }
    });
    preferenceResult.forEach(c => {
      if (!nameToId.has(c.company)) {
        console.warn(`DB에 없는 회사명(preferenceResult): "${c.company}"`);
      }
    });
    const prefWithId = preferenceResult
      .map(c => ({
        companyId: nameToId.get(c.company),
        similarity: c.similarity,
        company: c.company,
      }))
      .filter(c => c.companyId);

    const abilityWithId = abilityResult
      .map(c => ({
        companyId: nameToId.get(c.company),
        score: c.score,
        company: c.company,
      }))
      .filter(c => c.companyId);

    // 3. companyId 기준으로 평균 계산
    const allCompanyIds = new Set([
      ...prefWithId.map(c => c.companyId),
      ...abilityWithId.map(c => c.companyId),
    ]);

    const avgList = Array.from(allCompanyIds).map(companyId => {
      const pref = prefWithId.find(c => c.companyId === companyId);
      const ability = abilityWithId.find(c => c.companyId === companyId);
      const similarity = pref?.similarity ?? 0;
      const score = ability?.score ?? 0;
      const avgScore =
        pref && ability ? (similarity + score) / 2 : pref ? similarity : score;
      return {
        companyId,
        company: pref?.company || ability?.company || '',
        avgScore,
      };
    });
    // avgList 로그
    console.log('avgList:', avgList);

    // 2. companyName → companyId 변환 (ability, address 포함)
    const companies = await this.prismaService.company.findMany({
      where: {}, // 전체 회사 불러오기 (정규화 매칭 위해)
      select: {
        id: true,
        name: true,
        address: true,
        companyAbility: {
          select: {
            gpa: true,
            certificationCnt: true,
            awardsCnt: true,
            internshipCnt: true,
            clubActivityCnt: true,
            englishScores: true,
          },
        },
      },
    });

    // 3. CompanyJob에서 jobs 필터링 (직무명도 정규화 제거)
    const allJobsData = await this.prismaService.companyJob.findMany({
      where: {
        companyId: { in: companies.map(c => c.id) },
      },
      select: {
        companyId: true,
        jobName: true,
        salary: true,
        vision: true,
        task: true,
      },
    });
    // jobs 배열과 job.jobName을 그대로 비교하여 필터링
    const jobsData = allJobsData.filter(job => jobs.includes(job.jobName));

    // 4. 결과 조합 (companyId 기준 매칭)
    return jobsData.map(job => {
      const company = companies.find(c => c.id === job.companyId);
      const avgScore = avgList.find(
        c => c.companyId === job.companyId
      )?.avgScore;
      // 매칭 로그
      console.log(
        '회사명:',
        company?.name,
        '| companyId:',
        job.companyId,
        '| avgScore:',
        avgScore
      );
      return {
        companyId: job.companyId,
        companyName: company?.name,
        finalScore: avgScore,
        companyGpa: company?.companyAbility?.gpa,
        companyCertification: company?.companyAbility?.certificationCnt,
        companyAwards: company?.companyAbility?.awardsCnt,
        companyInternship: company?.companyAbility?.internshipCnt,
        companyClubActivity: company?.companyAbility?.clubActivityCnt,
        companyEnglish: company?.companyAbility?.englishScores,
        userGpa: userInfo.schoolScore,
        userCertification: userInfo.certificationCount,
        userAwards: userInfo.awardsCount,
        userInternship: userInfo.internshipCount,
        userClubActivity: userInfo.clubActivityCount,
        userEnglish: userInfo.englishScores,
        // 필요하다면 아래도 추가
        jobName: job.jobName,
        salary: job.salary,
        vision: job.vision,
      };
    });
  }
}
