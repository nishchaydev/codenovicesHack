import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        apiKey: { label: 'API Key', type: 'text' },
      },
      async authorize(credentials) {
        // Mock institutional authorization for demo
        if (credentials?.email || credentials?.apiKey) {
          return {
            id: 'usr_1001',
            name: credentials.email ? credentials.email.split('@')[0] : 'Researcher User',
            email: credentials.email || 'researcher@financialgraph.ai',
            role: credentials.apiKey ? 'RESEARCHER' : 'INSTITUTIONAL',
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
