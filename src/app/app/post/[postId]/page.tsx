"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Post from "@/components/Post";
import { useState } from "react";
import Link from "next/link";
import PageTitle from "@/components/PageTitle";

export default function PostPage() {
  const params = useParams();
  const [replyData, setreplyData] = useState("");
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const post = useQuery({
    queryKey: ["post", params.postId],
    queryFn: () => api.getPost(params.postId as string),
  });
  const replyToPost = useMutation({
    mutationFn: () =>
      api.replyToPost(params.postId as string, { content: replyData }),
    onSuccess: () => {
      setreplyData("");
      queryClient.invalidateQueries();
    },
  });
  const likeReplyToPost = useMutation({
    mutationFn: (replyId: string) => api.likeReplyToPost(replyId),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
  console.log(post);
  return (
    <>
      <PageTitle title="Post" />

      {post.isSuccess ? (
        <>
          <Post post={post.data} />{" "}
          <div className="flex justify-between gap-4 border-b-2 items-center border-gray-700 p-4">
            <div>
              <Image
                src={session?.user?.image ?? ""}
                className="w-14 rounded-full  "
                width={40}
                height={40}
                alt="logo"
              />
            </div>
            <input
              onChange={(e) => setreplyData(e.target.value)}
              value={replyData}
              placeholder="What is your reply?"
              className="px-4 py-2 w-full outline-none bg-transparent border-b-2 border-gray-700"
            />
            <div>
              <button
                onClick={() => replyToPost.mutate()}
                className="bg-gray-700 p-2 rounded-lg text-white"
              >
                Reply
              </button>
            </div>
          </div>
          {""}
          {post.data.replies.map((reply: any, index: any) => (
            <div key={index} className="border-b-2 border-gray-700 ">
              <div className="flex gap-4 items-center p-4">
                <Image
                  src={reply.user.image}
                  className="w-14 rounded-full  "
                  width={40}
                  height={40}
                  alt="logo"
                />
                <div>
                  <Link
                    href={"/app/profile/" + reply.userId}
                    className="font-semibold text-lg"
                  >
                    {reply.user.name}
                  </Link>
                  <div>{reply.user.email}</div>
                </div>
              </div>
              <div className="p-4">{reply.content}</div>
              <div className="flex justify-between items-center mt-4 ">
                <button
                  disabled
                  className="text-gray-700  border-y-2 text-center   p-2 border-gray-700 w-full"
                >
                  Retweet
                </button>
                <button
                  onClick={() => likeReplyToPost.mutate(reply.id)}
                  className={
                    reply.requesterHasLiked
                      ? "text-gray-200 font-semibold  border-y-2 p-2 text-center hover:border-x-2 border-gray-700 w-full"
                      : "text-gray-700  border-y-2 p-2 text-center hover:border-x-2 border-gray-700 w-full"
                  }
                >
                  {reply.likes?.length} Likes
                </button>

                <button className="text-gray-700 border-y-2 p-2 text-center hover:border-x-2 border-gray-700 w-full">
                  Share
                </button>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
