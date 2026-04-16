"use server";

import { env } from "@/env";

export async function refresh() {
  try {
    const res = await fetch(env.API_URL + "/refresh");
    if (res.ok) {
      return 200;
    }
    throw new Error();
  } catch (err) {
    console.error(err);
    return undefined;
  }
}
