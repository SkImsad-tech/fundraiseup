import randomstring from "randomstring";
import { IUser } from "./schemas";

export const randomize = (): string =>
  randomstring.generate({
    length: 8,
    charset: "alphabetic",
  });

export function anonymizeCustomer(updatedFields: IUser): IUser {
  const anonymized: IUser = {
    ...updatedFields,
    firstName: updatedFields.firstName && randomize(),
    lastName: updatedFields.lastName && randomize(),
    email:
      updatedFields.email &&
      `${randomize()}@${updatedFields.email.split("@")[1]}`.toLowerCase(),
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
