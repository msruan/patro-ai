"use server";

import { Info } from "@/lib/schemas";
import * as jsonfile from "jsonfile";
import { connectToDb } from "@/lib/database";
import { logger } from "@/lib/logger";

export async function refresh() {
  try {
    await connectToDb();

    let infos = await Info.find();
    infos = infos.map((info) => info.data);

    jsonfile.writeFileSync("./context.json", infos);

    return;
  } catch (err) {
    logger.info(err);
    throw err;
  }
}