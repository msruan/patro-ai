import mongoose, { Schema } from "mongoose";

// Esquema flexível, sem definição de campos
const InfoSchema = new Schema({}, { strict: false });

// Exportando o modelo Info, reutilizando-o se já existir
export const Info = mongoose.models?.Info || mongoose.model("Info", InfoSchema);
