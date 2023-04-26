import { ObjectId, Schema, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string; //Email
  address: {
    line1: string;
    line2: string;
    postcode: string;
    city: string;
    state: string;
    country: string;
  };
  createdAt: string;
}

const Customer = new Schema<IUser>({
  _id: Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  email: String, //Email
  address: {
    line1: String,
    line2: String,
    postcode: String,
    city: String,
    state: String,
    country: String,
  },
  createdAt: Date,
});

export default Customer;
