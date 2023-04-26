import dotenv from "dotenv";
dotenv.config();
import { faker } from "@faker-js/faker";
import { model, connect, Types, Schema, Model } from "mongoose";
import CustomerSchema, { IUser } from "./db.schema";

export function createRandomUser(): IUser {
  return {
    _id: new Types.ObjectId(),
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
    createdAt: new Date().toISOString(),
  };
}

function getRandomInt(max: number, min: number = 1): number {
  return Math.floor(Math.random() * max) + min;
}

async function initFakeDataInsert(Customer: Model<IUser>): Promise<void> {
  setInterval(async () => {
    const BulkLength = getRandomInt(10);
    const Users: IUser[] = Array(BulkLength)
      .fill(null)
      .map(() => createRandomUser());

    await Customer.insertMany(Users);
  }, 200);
}

async function main(): Promise<void> {
  await connect(process.env.DB_URI || "");
  const Customer = model<IUser>("Customer", CustomerSchema);

  initFakeDataInsert(Customer);
}

main().then(console.log).catch(console.error);
