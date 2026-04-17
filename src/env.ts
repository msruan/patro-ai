import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
    server: {
        API_URL: z.url(),
        MONGO: z.string(),

        OPENAI_API_MODEL: z.string(),
        OPENAI_API_KEY: z.string(),
        OPENAI_API_URL: z.string()
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