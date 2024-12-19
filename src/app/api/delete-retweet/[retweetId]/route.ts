import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import api from "@/lib/axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { retweetId } = req.query;

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await api.deleteRetweet(retweetId as string);
    return res.status(200).json({ message: "Retweet deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete retweet", error });
  }
}
