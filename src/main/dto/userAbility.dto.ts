import { IsIn, IsNumber, IsString } from 'class-validator';

export class UserAbilityDto {
  @IsNumber()
  gpa: number;

  @IsNumber()
  englishScores: number;

  @IsNumber()
  certificationCount: number;

  @IsNumber()
  internshipCount: number;

  @IsNumber()
  clubActivityCount: number;

  @IsNumber()
  awardsCount: number;

  @IsNumber()
  experienceYears: number;

  @IsString()
  @IsIn([
    '서울4년',
    '수도권4년',
    '지방4년',
    '초대졸',
    '대학원',
    '해외대학',
    '대졸4년',
    '고졸',
  ])
  schoolName: string;
}
