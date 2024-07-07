import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

// POST route for handling retweet creation/deletion
export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = params.postId;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const requestBody = await request.json();
    const { content } = requestBody;

    // Parallelize user and post retrieval
    const [post, requester] = await Promise.all([
      prisma.post.findUnique({
        where: { id: postId },
        include: { retweets: true },
      }),
      prisma.user.findUnique({ where: { email: session.user?.email ?? "" } }),
    ]);

    if (!post) {
      return NextResponse.json(
        { message: "Post could not be found" },
        { status: 404 }
      );
    }

    if (!requester) {
      return NextResponse.json(
        { message: "User could not be found" },
        { status: 404 }
      );
    }

    // Check if the retweet exists
    const existingRetweet = await prisma.retweet.findUnique({
      where: { userId_postId: { userId: requester.id, postId: postId } },
    });

    if (existingRetweet) {
      await prisma.retweet.delete({
        where: { userId_postId: { userId: requester.id, postId: postId } },
      });
    } else {
      await prisma.retweet.create({
        data: {
          post: { connect: { id: postId } },
          user: { connect: { id: requester.id } },
          content: content,
        },
        include: { user: true },
      });
    }

    if (post.userId !== requester.id) {
      await prisma.notification.create({
        data: {
          user: { connect: { id: post.userId } },
          content: `${requester.name} has retweeted your post`,
          type: "retweet",
        },
      });
    }

    return NextResponse.json({ message: "Retweet successful" });
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
