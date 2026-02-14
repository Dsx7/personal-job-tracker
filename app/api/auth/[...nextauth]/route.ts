import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/db";
import User from "@/models/User";

const handler = NextAuth({
	secret: process.env.NEXTAUTH_SECRET, // <--- ADD THIS LINE
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        await connectToDB();
        const user = await User.findOne({ email: credentials?.email });
        if (!user) return null;
        const passwordMatch = await bcrypt.compare(credentials!.password, user.password);
        return passwordMatch ? { id: user._id, email: user.email } : null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) session.user.id = token.sub!;
      return session;
    },
  },
  pages: { signIn: "/login" },
});

export { handler as GET, handler as POST };