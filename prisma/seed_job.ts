import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  await prisma.companyJob.deleteMany({});
  const data = JSON.parse(
    fs.readFileSync(__dirname + '/company_preference.json', 'utf8')
  );

  for (const item of data) {
    // 회사명으로 Company 찾기 (없으면 생성)
    let company = await prisma.company.findUnique({
      where: { name: item['기업명'] },
    });
    if (!company) {
      company = await prisma.company.create({ data: { name: item['기업명'] } });
    }

    // 직무명 처리
    const jobName = item['직무명'] || item['job'] || '기타';

    // CompanyJob 생성 (중복 방지: 회사+직무명 기준)
    const exist = await prisma.companyJob.findUnique({
      where: {
        companyId_jobName: {
          companyId: company.id,
          jobName,
        },
      },
    });

    if (exist) {
      await prisma.companyJob.update({
        where: {
          companyId_jobName: {
            companyId: company.id,
            jobName,
          },
        },
        data: {
          task: item['담당업무'] || item['task'] || '',
          salary: item['salary'] || null,
          vision: item['vision'] || '',
          traits: item['traits'] || null,
          scale: item['scale'] || null,
        },
      });
    } else {
      await prisma.companyJob.create({
        data: {
          companyId: company.id,
          jobName,
          task: item['담당업무'] || item['task'] || '',
          salary: item['salary'] || null,
          vision: item['vision'] || '',
          traits: item['traits'] || null,
          scale: item['scale'] || null,
        },
      });
    }
  }
  console.log('직무/담당업무 데이터 입력 완료!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
