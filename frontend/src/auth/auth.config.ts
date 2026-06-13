import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        accessToken: { label: "Access Token", type: "text" },
        id: { label: "User ID", type: "text" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        const accessToken = credentials?.accessToken;
        const id = credentials?.id;
        const email = credentials?.email;

        // Session is established after browser gRPC-Web auth (login/register).
        if (
          typeof accessToken === "string" &&
          typeof id === "string" &&
          typeof email === "string"
        ) {
          return {
            id,
            email,
            name:
              typeof credentials?.name === "string" && credentials.name
                ? credentials.name
                : email,
            accessToken,
          };
        }

        return null;
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
