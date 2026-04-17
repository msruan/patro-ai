import mongoose, { Model } from "mongoose";

const InfoSchema = new mongoose.Schema({}, { strict: false });

export const Info = mongoose.models?.Info as Model<any> || mongoose.model("Info", InfoSchema);
