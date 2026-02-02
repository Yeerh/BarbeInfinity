// src/app/_lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { db } from "@/app/_lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Admin",
      credentials: {
        username: { label: "Login", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username;
        const password = credentials?.password;

        if (username !== "Admin" || password !== "123456") {
          return null;
        }

        const adminEmail = "admin@barbearia.local";
        const admin = await db.user.upsert({
          where: { email: adminEmail },
          update: { role: "ADMIN", name: "Admin" },
          create: { email: adminEmail, name: "Admin", role: "ADMIN" },
        });

        return {
          id: admin.id,
          name: admin.name ?? "Admin",
          email: admin.email,
          role: admin.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role =
          (user as { role?: "ADMIN" | "CLIENT" }).role ?? "CLIENT";
      }
      if (token.id && !token.role) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        });
        token.role = (dbUser?.role ?? "CLIENT") as "ADMIN" | "CLIENT";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id as string;
        (
          session.user as typeof session.user & {
            role?: "ADMIN" | "CLIENT";
          }
        ).role = token.role as "ADMIN" | "CLIENT";
      }
      return session;
    },
  },
};
