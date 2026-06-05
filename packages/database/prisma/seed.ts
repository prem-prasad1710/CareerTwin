import { PrismaClient, SkillCategory } from '@prisma/client';

const prisma = new PrismaClient();

const SKILLS = [
  { name: 'React', category: SkillCategory.FRONTEND, demandScore: 92, salaryImpact: 8 },
  { name: 'TypeScript', category: SkillCategory.FRONTEND, demandScore: 95, salaryImpact: 12 },
  { name: 'Next.js', category: SkillCategory.FRONTEND, demandScore: 88, salaryImpact: 10 },
  { name: 'Node.js', category: SkillCategory.BACKEND, demandScore: 90, salaryImpact: 10 },
  { name: 'Python', category: SkillCategory.BACKEND, demandScore: 94, salaryImpact: 12 },
  { name: 'System Design', category: SkillCategory.ARCHITECTURE, demandScore: 85, salaryImpact: 21 },
  { name: 'AWS', category: SkillCategory.CLOUD, demandScore: 91, salaryImpact: 15 },
  { name: 'Docker', category: SkillCategory.DEVOPS, demandScore: 87, salaryImpact: 8 },
  { name: 'Kubernetes', category: SkillCategory.DEVOPS, demandScore: 82, salaryImpact: 14 },
  { name: 'Machine Learning', category: SkillCategory.AI_ML, demandScore: 96, salaryImpact: 25 },
  { name: 'PostgreSQL', category: SkillCategory.DATA, demandScore: 88, salaryImpact: 10 },
  { name: 'Redis', category: SkillCategory.BACKEND, demandScore: 80, salaryImpact: 8 },
  { name: 'GraphQL', category: SkillCategory.BACKEND, demandScore: 75, salaryImpact: 7 },
  { name: 'Leadership', category: SkillCategory.LEADERSHIP, demandScore: 90, salaryImpact: 18 },
  { name: 'Product Management', category: SkillCategory.PRODUCT, demandScore: 85, salaryImpact: 15 },
  { name: 'Communication', category: SkillCategory.SOFT_SKILL, demandScore: 95, salaryImpact: 10 },
  { name: 'Data Structures', category: SkillCategory.BACKEND, demandScore: 93, salaryImpact: 12 },
  { name: 'Algorithms', category: SkillCategory.BACKEND, demandScore: 91, salaryImpact: 12 },
  { name: 'Microservices', category: SkillCategory.ARCHITECTURE, demandScore: 84, salaryImpact: 16 },
  { name: 'Terraform', category: SkillCategory.DEVOPS, demandScore: 78, salaryImpact: 12 },
];

const MARKET_DATA = [
  { role: 'Software Engineer', location: 'San Francisco', industry: 'Technology', minSalary: 120000, maxSalary: 200000, medianSalary: 155000, demandIndex: 92, growthRate: 8.5 },
  { role: 'Software Engineer', location: 'New York', industry: 'Technology', minSalary: 110000, maxSalary: 180000, medianSalary: 140000, demandIndex: 88, growthRate: 7.2 },
  { role: 'Software Engineer', location: 'Bangalore', industry: 'Technology', minSalary: 1500000, maxSalary: 4000000, medianSalary: 2500000, demandIndex: 95, growthRate: 12.0 },
  { role: 'Senior Software Engineer', location: 'San Francisco', industry: 'Technology', minSalary: 180000, maxSalary: 280000, medianSalary: 220000, demandIndex: 90, growthRate: 7.8 },
  { role: 'Senior Software Engineer', location: 'Bangalore', industry: 'Technology', minSalary: 3000000, maxSalary: 6000000, medianSalary: 4200000, demandIndex: 93, growthRate: 11.5 },
  { role: 'Staff Engineer', location: 'San Francisco', industry: 'Technology', minSalary: 250000, maxSalary: 400000, medianSalary: 310000, demandIndex: 75, growthRate: 6.0 },
  { role: 'Product Manager', location: 'San Francisco', industry: 'Technology', minSalary: 130000, maxSalary: 220000, medianSalary: 170000, demandIndex: 85, growthRate: 6.5 },
  { role: 'Frontend Engineer', location: 'Remote', industry: 'Technology', minSalary: 90000, maxSalary: 160000, medianSalary: 120000, demandIndex: 87, growthRate: 9.0 },
];

async function main() {
  console.log('Seeding CareerTwin database...');

  for (const skill of SKILLS) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: skill,
      create: skill,
    });
  }

  for (const data of MARKET_DATA) {
    await prisma.marketData.upsert({
      where: {
        role_location_industry: {
          role: data.role,
          location: data.location,
          industry: data.industry,
        },
      },
      update: data,
      create: data,
    });
  }

  const skills = await prisma.skill.findMany();
  const roles = ['Software Engineer', 'Senior Software Engineer', 'Staff Engineer'];

  for (const skill of skills) {
    for (const role of roles) {
      await prisma.jobMarketSkill.upsert({
        where: { skillId_role: { skillId: skill.id, role } },
        update: {
          demandScore: skill.demandScore,
          salaryPremium: skill.salaryImpact,
          growthTrend: Math.random() * 10 + 2,
        },
        create: {
          skillId: skill.id,
          role,
          demandScore: skill.demandScore,
          salaryPremium: skill.salaryImpact,
          growthTrend: Math.random() * 10 + 2,
        },
      });
    }
  }

  console.log('Seed complete.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
