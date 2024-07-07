import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const retweets = await prisma.retweet.findMany({
    include: {
      user: true,
      likes: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  const response = retweets.map((retweet) => ({
    ...retweet,
    requesterHasLiked: retweet.likes.some(
      (like) => like.userId === (session.user as { id: string })?.id
    ),
  }));
  console.log(response);
  return NextResponse.json(response, { status: 200 });
}
