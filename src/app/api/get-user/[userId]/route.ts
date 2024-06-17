import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  let user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      followed: true,
      following: true,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "No user found" }, { status: 404 });
  }

  const requester = await prisma.user.findUnique({
    where: { email: session.user?.email ?? "" },
  });

  if (!requester) {
    return NextResponse.json(
      {
        message: "User not found",
      },
      { status: 404 }
    );
  }

  const follow = await prisma.follow.findFirst({
    where: {
      followedId: user.id,
      followingId: requester.id,
    },
  });

  let userWithFollowing;
  if (follow) {
    userWithFollowing = { ...user, isFollowing: true };
  } else {
    userWithFollowing = { ...user, isFollowing: false };
  }

  return NextResponse.json(userWithFollowing, { status: 200 });
}
