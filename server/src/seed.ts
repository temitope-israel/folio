import "dotenv/config"
import prisma from "./lib/prisma";

async function seed() {
  // Clear existing visit data first
  await prisma.pageVisit.deleteMany({});
  console.log("🗑️ Cleared existing visits");

  const visits = [];
  const pages = ["/", "/", "/", "#projects", "#about", "#contact", "#services"];
  const devices = ["desktop", "desktop", "mobile", "mobile", "tablet"];

  // 66 visits older than 7 days (total - last7days = 89 - 23 = 66)
  for (let i = 0; i < 53; i++) {
    const daysAgo = Math.floor(Math.random() * 13) + 8;
    // 8 to 30 days ago — outside the last 7 days window
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(Math.floor(Math.random() * 24));

    visits.push({
      page: pages[Math.floor(Math.random() * pages.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      createdAt: date,
    });
  }

  // 23 visits in the last 7 days
  for (let i = 0; i < 23; i++) {
    const daysAgo = Math.floor(Math.random() * 7);
    // 0 to 6 days ago — inside the last 7 days window
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(Math.floor(Math.random() * 24));

    visits.push({
      page: pages[Math.floor(Math.random() * pages.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      createdAt: date,
    });
  }

  await prisma.pageVisit.createMany({ data: visits });
  console.log(`✅ Seeded ${visits.length} page visits (89 total, 23 last 7 days)`);
  await prisma.$disconnect();
}

seed().catch(console.error);