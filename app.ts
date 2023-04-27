import dotenv from "dotenv";
dotenv.config();
import { model, connect, Model } from "mongoose";
import { IUser, CustomerSchema } from "./src/schemas";
import { createRandomUser, getRandomInt } from "./src/helpers";

async function initFakeDataInsert(Customer: Model<IUser>): Promise<void> {
  setInterval(async () => {
    const BulkLength: number = getRandomInt();
    const Users: IUser[] = Array(BulkLength)
      .fill(null)
      .map(() => createRandomUser());
    await Customer.insertMany(Users);
    console.log("docs", Users.length);
  }, Number(process.env.PACK_GENERATION_TIMEOUT));
}

async function main(): Promise<void> {
  await connect(process.env.DB_URI || "");
  const Customer = model<IUser>("Customers", CustomerSchema);
  initFakeDataInsert(Customer);
}

main().then(console.log).catch(console.error);
