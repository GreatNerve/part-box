import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getGraphQLClient } from "@/lib/graphql/client";
import { LOGIN_MUTATION } from "@/lib/graphql/documents";
import { isValidationError } from "@/lib/graphql/errors";

export const authConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const client = getGraphQLClient();
        const data = await client.request(LOGIN_MUTATION, {
          input: { email, password },
        });

        const result = data.login;
        if (isValidationError(result)) {
          return null;
        }

        return {
          id: result.user.id,
          email: result.user.email,
          name: result.user.displayName ?? result.user.email,
          accessToken: result.token,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      if (token.id) {
        session.user.id = token.id as string;
      }
      if (token.email) {
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
