"use client";
import { createAuthClient } from "better-auth/react";

// No baseURL on purpose: it uses the current origin, so sign in / sign out
// work the same on localhost and on Vercel (a wrong baseURL is the #1 cause
// of "error on sign in / sign out").
export const authClient = createAuthClient();
