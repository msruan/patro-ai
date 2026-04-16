import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
    server: {
        GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
        API_URL: z.url(),
        MONGO: z.string()
    },
    client: {
        NEXT_PUBLIC_ALLOW_ADS_MODE: z.string()
            .default("false")
            .transform((bool) => bool.trim().toLowerCase() === "true"),
    },
    experimental__runtimeEnv: {
        NEXT_PUBLIC_ALLOW_ADS_MODE: process.env.NEXT_PUBLIC_ALLOW_ADS_MODE,
    }
});