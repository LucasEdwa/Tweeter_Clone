import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(
  request: NextRequest,
  { params }: { params: { replyId: string } }
) {
  const replyId = params.replyId;

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const reply = await prisma.reply.findUnique({
    where: { id: replyId },
  });

  if (!reply) {
    return NextResponse.json(
      { message: "Reply could not be found" },
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

  const like = await prisma.like.findFirst({
    where: {
      replyId: replyId,
      userId: requester.id,
    },
  });

  if (like) {
    await prisma.like.delete({
      where: {
        id: like.id,
      },
    });
    return NextResponse.json({ message: "Like removed from reply" });
  } else {
    await prisma.like.create({
      data: {
        reply: { connect: { id: replyId } },
        user: { connect: { id: requester.id } },
      },
    });
    return NextResponse.json({ message: "Liked reply" });
  }
}
