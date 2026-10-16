import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// Reuse one Mongo client (prevents "too many connections" in dev / serverless)
const globalForMongo = globalThis;
const client =
  globalForMongo._mongoClient ?? new MongoClient(process.env.MONGODB_URI);
if (process.env.NODE_ENV !== "production") globalForMongo._mongoClient = client;
const db = client.db();

const social = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  social.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)
  social.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false, // after sign up -> go to the sign in page (assignment rule)
    minPasswordLength: 6,
  },
  socialProviders: social,
});
