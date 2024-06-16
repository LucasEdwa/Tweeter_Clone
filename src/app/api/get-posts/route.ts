import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? "" },
    include: {
      following: true,
    },
  });
  if (!user) {
    return NextResponse.json({ message: "No user found" }, { status: 402 });
  }
  const posts = await prisma.post.findMany({
    include: {
      user: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  let response = [];
  for (const post of posts) {
    for (const follow of user.following) {
      if (follow.followedId === post.userId) {
        response.push(post);
      }
    }
    if (user.id === post.userId) {
      response.push(post);
    }
  }
  return NextResponse.json({ response }, { status: 200 });
}
