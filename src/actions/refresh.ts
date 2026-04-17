"use server";

import { Info } from "@/lib/schemas";
import * as jsonfile from "jsonfile";
import { connectToDb } from "@/lib/database";
import { logger } from "@/lib/logger";
import { env } from "@/env";

export async function refresh() {
  if (!env.NEXT_PUBLIC_ALLOW_ADS_MODE) {
    return
  }

  try {
    await connectToDb();

    let infos = await Info.find();
    infos = infos.map((info) => info.data);

    jsonfile.writeFileSync("./context.json", infos);

    return;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}