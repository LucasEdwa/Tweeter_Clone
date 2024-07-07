"use client";

import React, { useState } from "react";
import Post from "@/components/Post";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Retweet({ postId }: { postId: string }) {
  const { data: session } = useSession();

  const {
    data: post,
    isLoading: postLoading,
    isError: postError,
    error: postErrorDetails,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => api.getPost(postId),
    enabled: !!postId,
  });

  const { data: retweets } = useQuery({
    queryKey: ["retweets"],
    queryFn: () => api.getRetweets(),
    enabled: !!postId,
  });
  if (!postId) return <div>Post ID is required.</div>;

  if (postLoading) return <div>Loading...</div>;

  if (postError) return <div>Error: {postErrorDetails?.message}</div>;

  return (
    <div className="flex flex-col bg-gray-700/20 p-8 rounded-3xl xs:p-0">
      <div className="items-center">
        {retweets &&
          retweets.map((retweet: any, index: number) => (
            <div key={index} className="mt-4 ">
              <div className="flex gap-2 items-center">
                <Image
                  src={retweet.user.image}
                  width={40}
                  height={40}
                  alt="retweet user image"
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <Link
                    href={`/app/profile/${retweet.user.id}`}
                    className="text-sm"
                  >
                    {retweet.user.name}
                  </Link>
                  <span className="text-xs text-gray-500">
                    {new Date(retweet.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="bg-gray-400 rounded-2xl">
                <p className="mt-2 text-sm text-gray-700 p-2 ">
                  {retweet.content}
                </p>

                <div className="p-0">{post && <Post post={post} />}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
