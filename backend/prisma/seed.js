import { PrismaClient } from '@prisma/client';
import { USER, PLACE, REVIEW, WISH, TRAVEL, DAY, EVENT } from './mock.js';

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.user.deleteMany();
  await prisma.place.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wish.deleteMany();
  await prisma.travel.deleteMany();
  await prisma.day.deleteMany();
  await prisma.event.deleteMany();

  // 목 데이터 삽입
  await prisma.user.createMany({
    data: USER,
    skipDuplicates: true,
  });

  await prisma.place.createMany({
    data: PLACE,
    skipDuplicates: true,
  });

  await prisma.review.createMany({
    data: REVIEW,
    skipDuplicates: true,
  });

  await prisma.wish.createMany({
    data: WISH,
    skipDuplicates: true,
  });

  await prisma.travel.createMany({
    data: TRAVEL,
    skipDuplicates: true,
  });

  await prisma.day.createMany({
    data: DAY,
    skipDuplicates: true,
  });

  await prisma.event.createMany({
    data: EVENT,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
