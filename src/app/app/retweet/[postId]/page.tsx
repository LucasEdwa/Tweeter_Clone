"use client";

import React, { useState } from "react";
import Post from "@/components/Post";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import PageTitle from "@/components/PageTitle";
import { useParams, redirect } from "next/navigation";

export default function RetweetPage() {
  const params = useParams();
  const { postId } = params;
  const { data: session } = useSession();
  const [retweet, setRetweet] = useState("");

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => api.getPost(postId as string),
    enabled: !!postId, // Ensure the query runs only when postId is valid
  });

  const createRetweet = useMutation({
    mutationFn: () => api.retweet(postId as string, retweet),
    onSuccess: () => {
      setRetweet("");
      redirect("/app");
    },
  });

  if (!postId) return <div>Post ID is required.</div>;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full">
      <PageTitle title="Retweet" />
      <div className="flex flex-col bg-gray-700/20 p-8 rounded-3xl">
        <div className="items-center">
          <div>
            <Image
              src={session?.user?.image ?? ""}
              className="w-7 rounded-full"
              width={40}
              height={40}
              alt="User Image"
            />
          </div>
          <input
            onChange={(e) => setRetweet(e.target.value)}
            value={retweet}
            placeholder="Tell us more..."
            className="px-4 py-2 w-full outline-none bg-transparent border-b-2 border-gray-700"
          />
          <div className="p-4">{post && <Post post={post} />}</div>
          <div>
            <button
              onClick={() => createRetweet.mutate()}
              className={
                post.requesterHasRetweeted
                  ? "text-gray-200 font-semibold border-y-2 p-2 text-center hover:border-x-2 border-gray-700 w-full"
                  : "text-gray-700 border-y-2 p-2 text-center hover:border-x-2 border-gray-700 w-full"
              }
            >
              Retweet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
