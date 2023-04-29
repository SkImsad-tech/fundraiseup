import dotenv from "dotenv";
dotenv.config();
import { faker } from "@faker-js/faker";
import { model, connect, Model } from "mongoose";
import { IUser, CustomerSchema } from "./src/schemas";

function getRandomInt(
  max: number = Number(process.env.MAX_PACK_GENERATED),
  min: number = Number(process.env.MIN_PACK_GENERATED)
): number {
  return Math.floor(Math.random() * max) + min;
}

export function createRandomUser(): IUser {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    address: {
      line1: faker.address.streetAddress(),
      line2: faker.address.buildingNumber(),
      postcode: faker.address.zipCode(),
      city: faker.address.cityName(),
      state: faker.address.state(),
      country: faker.address.country(),
    },
    createdAt: new Date(),
  };
}

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
