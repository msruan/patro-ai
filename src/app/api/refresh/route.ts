import { NextResponse } from "next/server";
import { Info } from "@/lib/schemas";
import * as jsonfile from "jsonfile";
import { connectToDb } from "@/lib/database";

export const GET = async (request: Request) => {
  try {
    await connectToDb();

    let infos = await Info.find();
    infos = infos.map((info) => info.data);
    console.log(infos);
    jsonfile.writeFileSync("./context.json", infos);

    return NextResponse.json({}, { status: 200, });
  } catch (err) {
    console.log(err);
    return NextResponse.error();
  }
};
