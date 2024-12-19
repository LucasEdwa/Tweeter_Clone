import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(
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

  // Check if the postId corresponds to a post
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

  if (post) {
    if (post.userId !== requester.id) {
      return NextResponse.json(
        { message: "You are not authorized to delete this post" },
        { status: 403 }
      );
    }

    // Delete related records first
    await prisma.like.deleteMany({
      where: { postId: postId },
    });
    await prisma.retweet.deleteMany({
      where: { postId: postId },
    });
    await prisma.reply.deleteMany({
      where: { postId: postId },
    });

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: "Post deleted" });
  }

  // Check if the postId corresponds to a retweet
  const retweet = await prisma.retweet.findUnique({
    where: { id: postId },
    include: {
      user: true,
    },
  });

  if (retweet) {
    if (retweet.userId !== requester.id) {
      return NextResponse.json(
        { message: "You are not authorized to delete this retweet" },
        { status: 403 }
      );
    }

    await prisma.retweet.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: "Retweet deleted" });
  }

  return NextResponse.json(
    { message: "Post or retweet not found" },
    { status: 404 }
  );
}
