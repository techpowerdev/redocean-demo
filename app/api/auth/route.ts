import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend the User type to include accessToken
declare module "next-auth" {
  interface User {
    accessToken?: string;
    [key: string]: unknown;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize called with credentials:", credentials);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          }
        );

        const user = await res.json();

        if (res.ok && user) {
          return user;
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT Callback", { token, user });
      if (user) {
        token.accessToken = user.accessToken;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// import { NextAuthOptions } from "next-auth";
// import { JWT } from "next-auth/jwt";
// import NextAuth from "next-auth/next";
// import CredentialsProvider from "next-auth/providers/credentials";

// async function refreshToken(token: JWT): Promise<JWT> {
//   const backendTokens = (token as { backendTokens: { refreshToken: string } })
//     .backendTokens;
//   const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/refresh", {
//     method: "POST",
//     headers: {
//       authorization: `Refresh ${backendTokens.refreshToken}`,
//     },
//   });
//   console.log("refreshed");

//   const response = await res.json();

//   return {
//     ...token,
//     backendTokens: response,
//   };
// }

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: {
//           label: "Username",
//           type: "text",
//           placeholder: "jsmith",
//         },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.username || !credentials?.password) return null;
//         const { username, password } = credentials;
//         const res = await fetch(
//           process.env.NEXT_PUBLIC_API_URL + "/auth/login",
//           {
//             method: "POST",
//             body: JSON.stringify({
//               username,
//               password,
//             }),
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         if (res.status == 401) {
//           console.log(res.statusText);

//           return null;
//         }
//         const user = await res.json();
//         return user;
//       },
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) return { ...token, ...user };

//       if (new Date().getTime() < token.backendTokens.expiresIn) return token;

//       return await refreshToken(token);
//     },

//     async session({ token, session }) {
//       session.user = token.user;
//       session.backendTokens = token.backendTokens;

//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
