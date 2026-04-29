import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs"; // Make sure you have this installed: npm install bcryptjs

const handler = NextAuth({
  providers: [
    // 1. YOUR EXISTING EMAIL/PASSWORD LOGIN
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectToDB();
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) return null; // No user, or user signed up with Google

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) return null;

        return { id: user._id.toString(), email: user.email, name: user.name };
      }
    }),

    // 2. NEW GOOGLE LOGIN
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    // When a user logs in with Google, check if they exist in DB. If not, create them!
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectToDB();
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          // Auto-register the Google user in your MongoDB
          await User.create({
            email: user.email,
            name: user.name || "Google User",
            // We don't save a password for Google users
          });
        }
      }
      return true;
    },
    
    // Attach the MongoDB User ID to the session so your Job scraper can use it
    async session({ session }) {
      if (session.user?.email) {
        await connectToDB();
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
          (session.user as any).id = dbUser._id.toString();
        }
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };