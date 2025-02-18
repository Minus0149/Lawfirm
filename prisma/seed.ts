import { AdPlacement, PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { faker } from "@faker-js/faker"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("adminpassword", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@lexinvictus.com" },
    update: {},
    create: {
      email: "admin@lexinvictus.com",
      emailLowercase: "admin@lexinvictus.com",
      name: "Admin User",
      password: adminPassword,
      role: "SUPER_ADMIN",
      emailVerified: faker.date.past(),
    },
  })

  // Create main categories
  const mainCategories = [
    { name: "Law Notes", slug: "law-notes" },
    { name: "Case Briefs", slug: "case-briefs" },
    { name: "Legal Articles", slug: "legal-articles" },
    { name: "Exam Materials", slug: "exam-materials" },
  ]

  for (const category of mainCategories) {
    const mainCat = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
        description: faker.lorem.sentence(),
      },
    })

    // Create subcategories
    for (let i = 0; i < 3; i++) {
      const subCatName = faker.lorem.words(2)
      const subCat = await prisma.category.create({
        data: {
          name: subCatName,
          slug: faker.helpers.slugify(subCatName).toLowerCase(),
          description: faker.lorem.sentence(),
          parentId: mainCat.id,
        },
      })

      // Create articles for each subcategory
      for (let j = 0; j < 5; j++) {
        await prisma.article.create({
          data: {
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(5),
            status: "PUBLISHED",
            imageUrl: faker.image.url(),
            category: { connect: { id: subCat.id } },
            author: { connect: { id: admin.id } },
            views: faker.number.int({ min: 0, max: 1000 }),
            likes: faker.number.int({ min: 0, max: 100 }),
            shares: faker.number.int({ min: 0, max: 50 }),
          },
        })
      }
    }
  }

  // Create sample advertisements
  const adPlacements:AdPlacement[] = ["TOP_BANNER", "SIDEBAR"]
  for (let i = 0; i < 10; i++) {
    await prisma.advertisement.create({
      data: {
        link: faker.internet.url(),
        image: faker.lorem.sentence(),
        imageFile: faker.image.url(),
        placement: faker.helpers.arrayElement(adPlacements),
        startDate: faker.date.past(),
        endDate: faker.date.future(),
        views: faker.number.int({ min: 0, max: 10000 }),
        clicks: faker.number.int({ min: 0, max: 1000 }),
      },
    })
  }

  // Create sample legal drafts
  for (let i = 0; i < 10; i++) {
    await prisma.legalDraft.create({
      data: {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        category: faker.helpers.arrayElement(["contract", "agreement", "motion", "pleading", "other"]),
        author: { connect: { id: admin.id } },
      },
    })
  }

  // Create sample notes
  for (let i = 0; i < 10; i++) {
    await prisma.note.create({
      data: {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        fileUrl: faker.internet.url(),
        content: faker.lorem.paragraphs(3), // Added content property
        category: { connect: { id: (await prisma.category.findFirst())?.id || '' } },
        author: { connect: { id: admin.id } },
        downloads: faker.number.int({ min: 0, max: 1000 }),
      },
    })
  }

  console.log({ admin })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

