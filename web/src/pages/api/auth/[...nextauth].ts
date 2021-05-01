import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { query } from 'faunadb';

import fauna from '../../../services/fauna';

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user',
    }),
  ],
  jwt: {
    signingKey: process.env.SIGNING_KEY,
  },
  callbacks: {
    async signIn(user, account, profile) {
      const { email } = user;

      try {
        await fauna.query(
          query.If(
            query.Not(
              query.Exists(
                query.Match(
                  query.Index('USER_BY_EMAIL'),
                  query.Casefold(email),
                ),
              ),
            ),
            query.Create(query.Collection('USERS'), {
              data: {
                email,
              },
            }),
            query.Get(
              query.Match(query.Index('USER_BY_EMAIL'), query.Casefold(email)),
            ),
          ),
        );

        return true;
      } catch (e) {
        console.error(e);

        return false;
      }
    },
  },
});
