import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? "" },
    include: {
      following: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "User could not be found" },
      { status: 402 }
    );
  }

  const posts = await prisma.post.findMany({
    include: {
      user: true,
      likes: true,
      retweets: true,

      replies: {
        include: { likes: true },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const response = posts
    .filter(
      (post) =>
        user.following.some((follow) => follow.followedId === post.userId) ||
        post.userId === user.id
    )
    .map((post) => ({
      ...post,
      requesterHasLiked: post.likes.some((like) => like.userId === user.id),
      replies: post.replies.map((reply) => ({
        ...reply,
        requesterHasLiked: reply.likes.some((like) => like.userId === user.id),
      })),
      requesterHasRetweeted: post.retweets.some(
        (retweet) => retweet.userId === user.id
      ),
    }));

  return NextResponse.json(response, { status: 200 });
}
