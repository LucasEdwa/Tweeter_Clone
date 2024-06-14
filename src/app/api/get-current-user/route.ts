import {getServerSession} from "next-auth";
import { NextRequest,NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {authOptions} from "../auth/[...nextauth]/route"

export  async function GET(request: NextRequest) {

    const session = await getServerSession(authOptions);
    
    if (!session) {
        return NextResponse.json(
            {
                message: "Unauthorized"
            },
            { status: 401 }
        );
    }
    const user = await prisma.user.findUnique({
        where: { email: session.user?.email ?? "" }
    });
    if (!user) {
        return NextResponse.json({ message: "No user found" }, { status: 402 });
    }
    return NextResponse.json({ user }, { status: 200 });
}