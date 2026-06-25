import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  trustedOrigins: [
    "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "collaborator",
        input: true,
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
        input: true,
      },
      isPremium: {
        type: "boolean",
        defaultValue: false,
        input: true,
      },
      skills: {
        type: "string",
        defaultValue: "",
        input: true,
      },
      bio: {
        type: "string",
        defaultValue: "",
        input: true,
      },
    },
  },
});
