import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SurveyDto {
  @IsNumber()
  gpa: number; // 학점

  @IsNumber()
  @IsOptional()
  englishScores: number; //토익 점수

  @IsNumber()
  @IsOptional()
  certificationCount: number; //자격증 수

  @IsNumber()
  @IsOptional()
  internshipCount: number; //인턴 경험 수

  @IsNumber()
  @IsOptional()
  clubActivityCount: number; //동아리 활동 수

  @IsNumber()
  @IsOptional()
  awardsCount: number; //수상 경험 수

  @IsString()
  schoolName: string; //최종학력 (서울4년/수도권4년/지방4년/초대졸/대학원/해외대학/대졸4년/고졸),

  @IsNumber()
  experienceYears: number; //경력 년수
}
