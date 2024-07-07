import React from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCopyToClipboard } from "usehooks-ts";
import api from "@/lib/axios";
import Image from "next/image";

export default function Post({
  post,
  isRetweet,
}: {
  post: any;
  isRetweet?: boolean;
}) {
  const [value, copy] = useCopyToClipboard();

  const queryClient = useQueryClient();
  const likePost = useMutation({
    mutationFn: () => api.likePost(post.id as string),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
  return (
    <div className="flex flex-col  gap-2  border-b-gray-700 xs:w-fit">
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
          </h4>
        </div>
      </div>
      <p className="px-4">{post.content}</p>
      <div className="flex justify-between items-center mt-4 xs:text-xs  xs:w-full">
        <Link
          className="text-gray-700 border-y-2 p-2 text-center hover:border-x-2 border-gray-700 w-full"
          href={"/app/post/" + post.id}
        >
          {post.replies?.length} Replies
        </Link>
        <Link
          href={`/app/retweet/${post.id}`}
          className={
            post.requesterHasRetweeted
              ? "text-gray-200 font-semibold border-y-2 p-2 text-center hover:border-x-2 border-gray-700 xs-p-0 w-full"
              : "text-gray-700 border-y-2 p-2 text-center hover:border-x-2 border-gray-700 w-full"
          }
        >
          {post.retweets?.length} Retweet
        </Link>
        <button
          onClick={() => likePost.mutate()}
          disabled={isRetweet}
          className={
            post.requesterHasLiked
              ? "text-gray-200 font-semibold border-y-2 p-2 text-center hover:border-x-2 border-gray-700 w-full"
              : "text-gray-700 border-y-2 p-2 text-center hover:border-x-2 border-gray-700 w-full"
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
