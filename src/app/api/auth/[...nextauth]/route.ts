import { PrismaAdapter} from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import NextAuth from "next-auth";
import prisma from "@/lib/prisma"


export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
          clientId: process.env.GITHUB_CLIENT_ID ?? "",
          clientSecret: process.env.GITHUB_SECRET_KEY ?? ""
        }),
      ]

}

export const handler = NextAuth(authOptions);

export {handler as GET, handler as POST}