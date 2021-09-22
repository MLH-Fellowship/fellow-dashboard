import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: "repo",
    }),
  ],
  secret: process.env.AUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
  },

  callbacks: {
    async redirect(url, baseUrl) {
      return "/";
    },
    async jwt(token, user, account, profile, isNewUser) {
      // Add access_token to the token right after signin
      if (account) {
        if (account.accessToken) {
          token.accessToken = account.accessToken;
        }
      }
      return token;
    },
    async session(session, token) {
      // Add property to session, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
