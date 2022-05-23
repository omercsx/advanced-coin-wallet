import { ConnectionHelper } from "./helpers/connectionHelper";
import { CryptoPriceHelper } from "./helpers/cryptoPriceHelper";
import { IRecurringJobDocument, RecurringJobModel } from "./models/recurringJob";
import UserCrypto from "./models/userCrypto";
import Wallet from "./models/wallet";
import { parseExpression } from "cron-parser";
import { setTimeout } from "timers/promises";
import ChangeRecordModel from "./models/changeRecord";
import http from "http";
const PORT = process.env.PORT || 5000;

async function main() {
  console.log("db", "Connecting to MongoDB...");
  await ConnectionHelper.connect();
  console.log("db", "Connected to MongoDB");

  console.log("job", "Starting job loop...");
  await jobLoop();
}

async function jobLoop() {
  while (true) {
    await checkAndRunRecurringJobs();
    await setTimeout(10000);
  }
}

async function checkAndRunRecurringJobs() {
  const jobsToRun = await getJobsToRun();

  console.log("running " + jobsToRun.length + " jobs");

  const jobPromises = jobsToRun.map((job) => {
    return handleRecurringJob(job);
  });

  await Promise.all(jobPromises);
}

async function getJobsToRun() {
  const now = new Date();
  const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);

  await RecurringJobModel.updateMany(
    {
      nextRunAt: { $lte: new Date() },
      enabled: true,
      $or: [{ beingTriggered: false }, { beingTriggered: true, beingTriggeredAt: { $lt: twoMinutesAgo } }],
    },
    {
      $set: { beingTriggered: true, beingTriggeredAt: now, lastRunAt: now },
    }
  );

  const jobsToRun = await RecurringJobModel.find({ beingTriggeredAt: now });
  return jobsToRun;
}

async function prepareJobForNextRun(job: IRecurringJobDocument) {
  const parsed = parseExpression(job.schedule);
  const nextRunAt = parsed.next().toDate();

  job.beingTriggered = false;
  job.nextRunAt = nextRunAt;
  await job.save();
}

async function handleRecurringJob(job: IRecurringJobDocument) {
  const wallet = await Wallet.findOne({ recurringJobId: job._id });

  if (!wallet) {
    return false;
  }

  const walletCryptos = await UserCrypto.find({ walletId: wallet._id }).populate({
    path: "exchange",
    select: "-symbols -createdAt -updatedAt",
  });

  if (!walletCryptos || walletCryptos.length === 0) {
    job.enabled = false;
    job.beingTriggered = false;
    await job.save();
    return false;
  }

  wallet.balance = 0;
  for (const crypto of walletCryptos) {
    const currentPrice = await CryptoPriceHelper.getPrice(
      crypto.exchange.baseApi + crypto.exchange.priceEndpoint + crypto.symbol,
      crypto.exchange.name,
      crypto.symbol
    );

    wallet.balance += +(currentPrice * crypto.amount).toFixed(4);
    wallet.balance = +wallet.balance.toFixed(4);
    crypto.lastPrice = currentPrice;
    await crypto.save();
  }

  await wallet.save();
  await ChangeRecordModel.create({
    eventDate: new Date(),
    value: wallet.balance,
    walletId: wallet._id,
  });

  await prepareJobForNextRun(job);
  return true;
}

const server = http.createServer(async (req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end();
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});

main();
