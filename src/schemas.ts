import { ObjectId, Schema, InferSchemaType } from "mongoose";

const mailRegValidate =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export const CustomerSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      validate: {
        validator: function (example: string) {
          return mailRegValidate.test(example);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid phone number!`,
      },
      required: [true, "User email required"],
    },
    address: {
      line1: String,
      line2: String,
      postcode: String,
      city: String,
      state: String,
      country: String,
    },
    createdAt: Date,
  },
  { collection: "customers", versionKey: false }
);

export const CustomerAnonymisedSchema = new Schema<IUser>(
  {
    ...CustomerSchema.obj,
  },
  { collection: "customers_anonymised", versionKey: false }
);

export type IUser = InferSchemaType<typeof CustomerSchema>;

export interface ICreateDoc {
  insertOne: { document: IUser };
}

export interface IUpdateDoc {
  updateOne: { filter: { _id: ObjectId }; update: IUser };
}
