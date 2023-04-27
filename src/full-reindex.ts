import { model, connect } from "mongoose";
import { CustomerSchema, CustomerAnonymisedSchema, IUser } from "./schemas";
import { anonymizeInsertCustomer } from "./helpers";

async function fullReindex(): Promise<void> {
  try {
    await connect(process.env.DB_URI || "");
    const Customer = model<IUser>("Customers", CustomerSchema);
    const CustomerAnonyms = model<IUser>(
      "Customers_anonymised",
      CustomerAnonymisedSchema
    );

    let counter = 0;
    let docs = [];
    console.time("reindex_timer");
    do {
      const result = await Customer.find({}, "+_id -__v", {
        skip: counter,
        limit: Number(process.env.DB_LIMIT_QUERY),
      })
        .lean()
        .exec();

      docs = result.map((doc) => {
        const res = anonymizeInsertCustomer(doc);
        return res;
      });
      counter = counter + docs.length;
      await CustomerAnonyms.insertMany(docs, { ordered: false });
    } while (false);
    console.timeEnd("reindex_timer");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

export default fullReindex;
