const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(
    fs.readFileSync(__dirname + '/company_ability.json', 'utf8')
  );

  for (const item of data) {
    // 어학 점수 파싱 (토익만 Int)
    let toeic = null;
    try {
      const lang = eval('(' + item['어학'].replace(/'/g, '"') + ')');
      toeic = typeof lang['토익'] === 'number' ? lang['토익'] : null;
    } catch (e) {
      toeic = null;
    }

    // 회사명으로 Company 찾기 (없으면 생성)
    let company = await prisma.company.findUnique({
      where: { name: item['기업명'] },
    });
    if (!company) {
      company = await prisma.company.create({ data: { name: item['기업명'] } });
    }

    // CompanyAbility upsert (companyId는 unique)
    await prisma.companyAbility.upsert({
      where: { companyId: company.id },
      update: {
        gpa: item['학점'],
        certificationCnt: item['자격증'],
        awardsCnt: item['수상'],
        internshipCnt: item['인턴'],
        clubActivityCnt: item['동아리'],
        englishScores: toeic,
      },
      create: {
        companyId: company.id,
        gpa: item['학점'],
        certificationCnt: item['자격증'],
        awardsCnt: item['수상'],
        internshipCnt: item['인턴'],
        clubActivityCnt: item['동아리'],
        englishScores: toeic,
      },
    });
  }
  console.log('완료!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
