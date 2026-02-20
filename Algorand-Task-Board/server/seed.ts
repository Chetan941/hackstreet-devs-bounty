import { db } from "./db";
import { users, tasks, userProfiles } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");
  const existingTasks = await db.select().from(tasks);
  if (existingTasks.length > 0) {
    console.log("Database already seeded");
    process.exit(0);
  }

  // Create a mock user
  const [mockUser] = await db.insert(users).values({
    email: "creator@example.com",
    firstName: "Alice",
    lastName: "Smith",
  }).returning();

  await db.insert(userProfiles).values({
    userId: mockUser.id,
    algorandAddress: "ALGO1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  });

  await db.insert(tasks).values([
    {
      title: "Write documentation for new API",
      description: "We need comprehensive documentation for the v2 endpoints. Must include examples.",
      rewardAmount: "50",
      creatorId: mockUser.id,
      status: "OPEN",
      contractAppId: 100101,
    },
    {
      title: "Fix bug in smart contract",
      description: "The escrow contract has an edge case where refunds fail. Please fix the PyTeal code.",
      rewardAmount: "150",
      creatorId: mockUser.id,
      status: "OPEN",
      contractAppId: 100102,
    },
    {
      title: "Design a logo for the dApp",
      description: "We need a Web3 aesthetic logo in SVG format.",
      rewardAmount: "25",
      creatorId: mockUser.id,
      status: "OPEN",
      contractAppId: 100103,
    }
  ]);
  console.log("Database seeded successfully");
  process.exit(0);
}

seed().catch(console.error);