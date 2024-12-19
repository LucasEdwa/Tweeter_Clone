import React from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCopyToClipboard } from "usehooks-ts";
import api from "@/lib/axios";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Post({
  post,
  isRetweet,
}: {
  post: any;
  isRetweet?: boolean;
}) {
  const [value, copy] = useCopyToClipboard();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const deletePost = useMutation({
    mutationFn: () => api.deletePost(post.id as string),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
  const likePost = useMutation({
    mutationFn: () => api.likePost(post.id as string),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
  const isPostOwner = session?.user?.id === post.userId;
  return (
    <div className="flex flex-col w-full justify-between gap-2 xs:py-3 border-b-gray-700 xs:w-fit">
      <div className="flex justify-between xs:gap-3">
        <div className="flex gap-2 p-4 xs:p-0 xs:w-full ">
          <Image
            src={post.user.image}
            className="w-14 h-14 rounded-full"
            alt="user"
            width={40}
            height={40}
          />

          <div className=" flex flex-col">
            <Link
              href={"/app/profile/" + post.userId}
              className="font-semibold text-lg xs:text-xs"
            >
              {post.user.name}
            </Link>
            <h4 className="text-gray-700 text-sm xs:text-xs">
              @{post.user.email}
            </h4>{" "}
          </div>
        </div>
        {isPostOwner && (
          <button
            onClick={() => deletePost.mutate()}
            className=" mr-7 xs:m-0 text-white "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-trash-2"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
          </button>
        )}
      </div>
      <p className="px-4">{post.content}</p>
      <div className="flex justify-between items-center mt-4 xs:text-xs  xs:w-full">
        <Link
          className="text-gray-700 border-y-2 p-2 text-center hover:border-x-2 border-gray-700 w-full flex items-center justify-center"
          href={"/app/post/" + post.id}
        >
          <span className="mr-1">{post.replies?.length}</span> Replies
        </Link>
        <Link
          href={`/app/retweet/${post.id}`}
          className={
            post.requesterHasRetweeted
              ? "text-gray-200 font-semibold border-y-2 p-2 text-center hover:border-x-2 border-gray-700 xs-p-0 w-full flex items-center justify-center"
              : "text-gray-700 border-y-2 p-2 text-center hover:border-x-2 border-gray-700 w-full flex items-center justify-center"
          }
        >
          <span className="mr-1">{post.retweets?.length}</span> Retweet
        </Link>
        <button
          onClick={() => likePost.mutate()}
          disabled={isRetweet}
          className={
            post.requesterHasLiked
              ? "text-gray-200 font-semibold border-y-2 p-2 text-center hover:border-x-2 border-gray-700 xs-p-0 w-full flex items-center justify-center"
              : "text-gray-700 border-y-2  p-2 text-center hover:border-x-2  border-gray-700 w-full"
          }
        >
          {post.likes.length} Likes
        </button>

        <button
          onClick={() =>
            copy(process.env.NEXT_PUBLIC_BASE_URL + "/app/post/" + post.id)
          }
          className="text-gray-700 border-y-2 p-2 text-center hover:border-x-2 border-gray-700 w-full"
        >
          {value ? "Copied" : "Share"}
        </button>
      </div>
    </div>
  );
}
