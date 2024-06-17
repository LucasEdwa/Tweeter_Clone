"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useState } from "react";
import Post from "@/components/Post";

export default function App() {
  const { data: session } = useSession();
  const [postData, setPostData] = useState("");
  const createPost = useMutation({
    mutationFn: () => api.createPost({ content: postData }),
    onSuccess: () => {
      setPostData("");
      posts.refetch();
    },
  });
  const posts = useQuery({
    queryKey: ["posts"],
    queryFn: api.getPosts,
  });
  return (
    <>
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
          onChange={(e) => setPostData(e.target.value)}
          value={postData}
          placeholder="What is happening?"
          className="px-4 py-2 w-full outline-none bg-transparent border-b-2 border-gray-700"
        />
        <div>
          <button
            onClick={() => createPost.mutate()}
            className="bg-gray-700 p-2 rounded-lg text-white"
          >
            Tweet
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        {posts.isSuccess ? (
          <>
            {posts.data?.map((post: any, index: any) => (
              <Post key={index} post={post} />
            ))}
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
}
