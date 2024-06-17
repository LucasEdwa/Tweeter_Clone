import React from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export default function Post({ post }) {
  const queryClient = useQueryClient();
  const likePost = useMutation({
    mutationFn: () => api.likePost(post.id as string),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
  return (
    <div className="flex flex-col  gap-2  border-b-gray-700">
      <div className="flex gap-2 p-4">
        <img
          src={post.user.image}
          className="w-14 h-14 rounded-full"
          alt="user"
        />
        <div className=" flex flex-col">
          <h3 className="font-semibold text-lg">{post.user.name}</h3>
          <h4 className="text-gray-700 text-sm">@{post.user.email}</h4>
        </div>
      </div>
      <p className="px-4">{post.content}</p>
      <div className="flex justify-between items-center mt-4 ">
        <Link
          className="text-gray-700 border-y-2 p-2 text-center hover:border-x-2 border-gray-700 w-full"
          href={"/app/post/" + post.id}
        >
          {post.replies?.length} Replies
        </Link>
        <button className="text-gray-700  border-y-2 text-center hover:border-x-2 p-2 border-gray-700 w-full">
          Retweet
        </button>
        <button
          onClick={() => likePost.mutate()}
          className={
            post.requesterHasLiked
              ? "text-gray-200 font-semibold  border-y-2 p-2 text-center hover:border-x-2 border-gray-700 w-full"
              : "text-gray-700  border-y-2 p-2 text-center hover:border-x-2 border-gray-700 w-full"
          }
        >
          {post.likes.length} Likes
        </button>

        <button className="text-gray-700 border-y-2 p-2 text-center hover:border-x-2 border-gray-700 w-full">
          Share
        </button>
      </div>
    </div>
  );
}
