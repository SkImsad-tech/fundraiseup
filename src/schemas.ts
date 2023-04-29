import { ObjectId, Schema, Types, InferSchemaType, Date } from "mongoose";

export interface ICreateDoc {
  insertOne: { document: IUser };
}

export interface IUpdateDoc {
  updateOne: { filter: { _id: ObjectId }; update: IUser };
}

export const CustomerSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true }, //Email
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
