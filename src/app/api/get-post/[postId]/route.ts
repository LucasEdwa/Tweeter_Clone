import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);
  const postId = params.postId;

  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  const requester = await prisma.user.findUnique({
    where: { email: session?.user?.email ?? "" },
  });
  if (!requester) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: true,
      likes: true,
      retweets: true,

      replies: {
        include: {
          user: true,
          likes: true,
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }
  const postWithLikeStatus = {
    ...post,
    requesterHasLiked: post.likes.some((like) => like.userId === requester.id),
    replies: post.replies.map((reply) => ({
      ...reply,
      requesterHasLiked: reply.likes.some(
        (like) => like.userId === requester.id
      ),
    })),
    requesterHasRetweeted: post.retweets.some(
      (retweet) => retweet.userId === requester.id
    ),
  };

  return NextResponse.json(postWithLikeStatus, { status: 200 });
}
