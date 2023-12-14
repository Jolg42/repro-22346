import { PrismaClient } from "@prisma/client";
import { MemoryLogger } from "./memory-logger";
import { v4 as uuid } from "uuid";

// Number of items to create in the database.
const arbitraryNumber = 2_000_000;

const memoryLogger = new MemoryLogger();

async function main() {
  const prisma = new PrismaClient({
    // With this logging enabled, you can see the queries sent to the MongoDB database
    log: ["query"],
  });

  const testCount = await prisma.test.count();
  console.log(`There are ${testCount} items in the database.`);

  // On the first run, create the table and seed it with some data.
  if (testCount < arbitraryNumber) {
    const chunkSize = 100_000;

    console.log(`Creating ${arbitraryNumber} items... This will take a while.`);

    for (let i = 0; i < arbitraryNumber; i += chunkSize) {
      console.log(`${chunkSize} new items created...`);
      const items = Array.from({ length: chunkSize }, () => ({
        id: uuid(),
        ap: 5,
        na: "test",
        sa: "test",
        co: "test",
        eq: 5,
        oi: "test",
        oq: 5,
        ot: "test",
        pr: 5,
        ro: false,
        si: "test",
        ps: "test",
        st: "test",
        sp: 5,
        cp: false,
        sy: "test",
        ti: 5,
        tf: "test",
        ty: "test",
        ac: 5,
        pr2: 5,
        ut: 5,
        wt: "test",
        pp: false,
        pi: "test",
        ic: false,
      }));

      await prisma.test.createMany({
        data: items,
      });
    }

    console.log(
      `There is now ${await prisma.test.count()} items in the database. Restart the script to run the memory logging.`
    );
    process.exit();
  }

  memoryLogger.maybeLog();

  for (let i = 0; i < 10_000; i++) {
    // Note: this logging approach works best when iterations are "fast"
    memoryLogger.maybeLog();

    await prisma.test.updateMany({
      data: {
        ic: false,
      },
    });
  }

  prisma.$disconnect();
}

main();
