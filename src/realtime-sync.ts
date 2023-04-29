import fs from "fs";
import { model, connect, Model } from "mongoose";
import {
  CustomerSchema,
  CustomerAnonymisedSchema,
  IUser,
  IUpdateDoc,
  ICreateDoc,
} from "./schemas";

import { anonymizeCustomer } from "./randomize";

let resumeToken: undefined | object = undefined;
if (fs.existsSync("./key.json")) {
  resumeToken = require("../key.json");
}

const timeoutPromise = () =>
  new Promise((resolve) => setTimeout(() => resolve(false), 1000));

function saveKey(data: typeof resumeToken): void {
  resumeToken = data;
  const key = JSON.stringify(data);
  fs.writeFile("./key.json", key, (err: any) => {
    if (err) {
      throw err;
    }
  });
}

async function watchUpdates(
  Collection: Model<IUser>,
  anonCollection: Model<IUser>
): Promise<void> {
  const changeStream = await Collection.watch(
    [
      {
        $match: {
          $or: [{ operationType: "insert" }, { operationType: "update" }],
        },
      },
    ],
    {
      resumeAfter: resumeToken,
    }
  );

  let doc = null;
  let docs: Array<IUpdateDoc | ICreateDoc> = [];

  const timer = timeoutPromise();
  while ((doc = await Promise.race([changeStream.next(), timer]))) {
    if (doc.operationType === "insert") {
      docs.push({
        insertOne: { document: anonymizeCustomer(doc.fullDocument) },
      });
    } else {
      docs.push({
        updateOne: {
          filter: { _id: doc.documentKey._id },
          update: anonymizeCustomer(doc.updateDescription.updatedFields),
        },
      });
    }
    saveKey(doc._id);
    if (docs.length === 1000) break;
  }
  console.log("docs", docs.length);

  await anonCollection.bulkWrite(docs);
  await changeStream.close();
}

async function realtimeSync(): Promise<void> {
  try {
    await connect(process.env.DB_URI || "");
    const Customer = model<IUser>("Customers", CustomerSchema);
    const CustomerAnonyms = model<IUser>(
      "CustomersAnonymised",
      CustomerAnonymisedSchema
    );

    while (true) {
      console.time("live timer");
      await watchUpdates(Customer, CustomerAnonyms);
      console.timeEnd("live timer");
    }
  } catch (err) {
    console.error(err);
  }
}

export default realtimeSync;
