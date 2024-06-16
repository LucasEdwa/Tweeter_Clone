import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST (request: NextRequest )
{
    const session = await getServerSession(authOptions);

    const  postData = await request.json();

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user?.email ?? ""}
    });

    if (!user) {
        return NextResponse.json({ message: "User could not be found" }, { status: 404 });
    }

     if (!postData.content) {
        return NextResponse.json({ message: "You've left empty fields" }, { status: 401 });
    }
    const post = await prisma.post.create({
        data: {
            content: postData.content,
            user: {
                connect: {
                    id: user.id
                }
            }
        }
    });

    

    return NextResponse.json({ message: "Post created" }, { status: 200 });

}