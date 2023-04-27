import randomstring from "randomstring";
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import { IUser, IUserUpdate } from "./schemas";

const randomize = (): string =>
  randomstring.generate({
    length: 8,
    charset: "alphabetic",
  });

export function anonymizeInsertCustomer(data: IUser): IUser {
  const anonymized: IUser = {
    ...data,
    firstName: randomize(),
    lastName: randomize(),
    email: `${randomize()}@${data.email.split("@")[1]}`,
    address: {
      ...data.address,
      line1: randomize(),
      line2: randomize(),
      postcode: randomize(),
    },
  };
  return anonymized;
}

export function anonymizeUpdateCustomer(
  updatedFields: IUserUpdate
): IUserUpdate {
  const anonymized: IUserUpdate = {
    ...updatedFields,
    firstName: updatedFields.firstName && randomize(),
    lastName: updatedFields.lastName && randomize(),
    email:
      updatedFields.email &&
      `${randomize()}@${updatedFields.email.split("@")[1]}`,
    address: {
      ...updatedFields.address,
      line1:
        updatedFields.address && updatedFields.address.line1 && randomize(),
      line2:
        updatedFields.address && updatedFields.address.line2 && randomize(),
      postcode:
        updatedFields.address && updatedFields.address.postcode && randomize(),
    },
  };
  return anonymized;
}

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

export function getRandomInt(
  max: number = Number(process.env.MAX_PACK_GENERATED),
  min: number = Number(process.env.MIN_PACK_GENERATED)
): number {
  return Math.floor(Math.random() * max) + min;
}
