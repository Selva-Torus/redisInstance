import NextAuth from "next-auth";
import CredentialProviders from "next-auth/providers/credentials";
import GoogleProviders from "next-auth/providers/google";
import GithubProviders from "next-auth/providers/github";
import { sign } from "jsonwebtoken";
import Path from "../../../favicon.ico";
import { authorizeUsers } from "@/utilsFunctions/authorizeUser";

let user;
const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialProviders({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        let datas = authorizeUsers.authorizeUser;
        try {
          const foundUser = datas.find(
            (user) =>
              user.username === credentials.username &&
              user.password === credentials.password
          );

          if (foundUser) {
            const jwtToken = sign(
              { username: credentials.username },
              process.env.JWT_SECRET,
              {
                expiresIn: "3m",
              }
            );
            user = { ...foundUser, token: jwtToken };
            return user;
          } else {
            throw new Error("Error during API call");
          }
        } catch (error) {
          console.error("Error during API call:", error?.response?.data?.error);
          throw new Error("Error during API call");
        }
      },
    }),
    GithubProviders({
      profile(profile) {
        const jwtToken = sign(
          { email: profile.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "3m",
          }
        );
        let userRole = "GitHub User";
        if (profile?.email == "amrishs@torus.tech") {
          userRole = "admin";
        }
        user = {
          ...profile,
          role: userRole,
          token: jwtToken,
        };
        return user;
      },
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProviders({
      profile(profile) {
        const jwtToken = sign(
          { email: profile.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "3m",
          }
        );
        let userRole = "Google User";
        user = {
          ...profile,
          id: profile.sub,
          role: userRole,
          token: jwtToken,
        };
        return user;
      },
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  theme: {
    logo: "/Torus-Logo.png", // Replace with the path to your logo
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role;
      session.user = user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };