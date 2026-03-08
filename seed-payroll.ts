import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('--- 💰 Seeding Payroll / Salaries ---');

  const user = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
  if (!user) {
    console.error('❌ No admin user found to seed payroll against.');
    return;
  }

  const salaries = [
    { month: 1, year: 2026, basicSalary: 50000, netPay: 48000 },
    { month: 2, year: 2026, basicSalary: 50000, netPay: 48000 },
  ];

  for (const s of salaries) {
    await prisma.payslip.upsert({
      where: { userId_month_year: { userId: user.id, month: s.month, year: s.year } },
      update: {},
      create: {
        userId: user.id,
        month: s.month,
        year: s.year,
        basicSalary: s.basicSalary,
        netPay: s.netPay,
        paidAt: new Date(),
      },
    });
  }

  console.log('✅ Payroll seeded for January and February 2026');
  await prisma.$disconnect();
}

main();
