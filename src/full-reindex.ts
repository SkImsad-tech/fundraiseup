import { model, connect } from "mongoose";
import { CustomerSchema, CustomerAnonymisedSchema, IUser } from "./schemas";
import { anonymizeCustomer } from "./randomize";

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
        limit: Number(100),
      })
        .lean()
        .exec();

      docs = result.map((doc) => {
        const res = anonymizeCustomer(doc);
        return res;
      });
      counter = counter + docs.length;
      try {
        await CustomerAnonyms.insertMany(docs, { ordered: false });
      } catch (err: any) {
        if (err.code !== Number(process.env.DUPLICATED_DOC_CODE)) throw err;
      }
    } while (docs.length > 0);
    console.timeEnd("reindex_timer");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

export default fullReindex;
