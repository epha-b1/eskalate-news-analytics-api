import { PrismaClient, Role, ArticleStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (in correct order due to foreign keys)
  await prisma.dailyAnalytics.deleteMany();
  await prisma.readLog.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();

  const saltRounds = 10;
  const commonPassword = await bcrypt.hash("StrongPass1!", saltRounds);

  // 1. Create Authors
  const author1 = await prisma.user.create({
    data: {
      name: "Author Jane",
      email: "jane@example.com",
      passwordHash: commonPassword,
      role: Role.author
    }
  });

  const author2 = await prisma.user.create({
    data: {
      name: "Author John",
      email: "john@example.com",
      passwordHash: commonPassword,
      role: Role.author
    }
  });

  // 2. Create Reader
  const reader1 = await prisma.user.create({
    data: {
      name: "Reader Bob",
      email: "bob@example.com",
      passwordHash: commonPassword,
      role: Role.reader
    }
  });

  console.log("Users created");

  // 3. Create Articles for Author Jane
  await prisma.article.create({
    data: {
      title: "The Future of Tech",
      content: "This is a very long and thoughtful article about where technology is heading in 2026. It contains more than fifty characters to pass validation.",
      category: "Tech",
      status: ArticleStatus.PUBLISHED,
      authorId: author1.id
    }
  });

  await prisma.article.create({
    data: {
      title: "Healthy Living in 2026",
      content: "Health and wellness are more important than ever. Here are some tips for staying fit and mindful in the modern world.",
      category: "Health",
      status: ArticleStatus.PUBLISHED,
      authorId: author1.id
    }
  });

  await prisma.article.create({
    data: {
      title: "Politics and Society",
      content: "A deep dive into current political landscapes and social shifts across the globe. This article is also published.",
      category: "Politics",
      status: ArticleStatus.PUBLISHED,
      authorId: author1.id
    }
  });

  await prisma.article.create({
    data: {
      title: "Private Draft",
      content: "This is a draft article that is not yet ready for public consumption. Only the author should see this.",
      category: "Sports",
      status: ArticleStatus.DRAFT,
      authorId: author1.id
    }
  });

  await prisma.article.create({
    data: {
      title: "Deleted News",
      content: "This article was published but then deleted. Readers should not find it, but it remains in the DB.",
      category: "Sports",
      status: ArticleStatus.PUBLISHED,
      authorId: author1.id,
      deletedAt: new Date()
    }
  });

  // 4. Create an Article for Author John
  await prisma.article.create({
    data: {
      title: "Sporting Excellence",
      content: "World class athletics and how to achieve peak performance. John's first contribution.",
      category: "Sports",
      status: ArticleStatus.PUBLISHED,
      authorId: author2.id
    }
  });

  console.log("Articles created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
