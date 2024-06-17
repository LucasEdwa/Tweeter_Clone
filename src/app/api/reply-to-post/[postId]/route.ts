import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  const postId = params.postId;
  const postData = await request.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      replies: {
        include: {
          likes: true,
          user: true,
        },
      },
    },
  });

  if (!post) {
    return NextResponse.json(
      { message: "Post could not be found" },
      { status: 404 }
    );
  }

  const requester = await prisma.user.findUnique({
    where: { email: session.user?.email ?? "" },
  });

  if (!requester) {
    return NextResponse.json(
      { message: "User could not be found" },
      { status: 404 }
    );
  }
  if (!postData.content) {
    return NextResponse.json(
      { message: "Content is required" },
      { status: 402 }
    );
  }
  await prisma.reply.create({
    data: {
      post: {
        connect: {
          id: postId,
        },
      },
      user: {
        connect: {
          id: requester.id,
        },
      },
      content: postData.content,
    },
  });

  return NextResponse.json({ message: "Reply created" });
}
