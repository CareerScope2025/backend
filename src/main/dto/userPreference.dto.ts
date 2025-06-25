import { IsArray, IsIn, IsNumber, IsString } from 'class-validator';

export class UserPreferenceDto {
  @IsNumber()
  salary: number;

  @IsString()
  introduction: string;

  @IsArray()
  jobs: string[];

  @IsNumber()
  traits: number;

  @IsString()
  @IsIn(['대기업', '중견기업', '스타트업', '공기업'])
  scale: string;
}
