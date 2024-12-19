"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useState } from "react";
import Post from "@/components/Post";
import PageTitle from "@/components/PageTitle";
import Retweet from "@/components/Retweet";

// Define the types for Post and Retweet
interface PostType {
  id: string;
  content: string;
  created_at: string;
}

interface RetweetType {
  postId: string;
  user: {
    image: string;
    id: string;
    name: string;
  };
  content: string;
  created_at: string;
}

export default function App() {
  const { data: session } = useSession();
  const [postData, setPostData] = useState("");

  const createPost = useMutation({
    mutationFn: () => api.createPost({ content: postData }),
    onSuccess: () => {
      setPostData("");
      posts.refetch();
      retweets.refetch();
    },
  });

  const posts = useQuery({
    queryKey: ["posts"],
    queryFn: api.getPosts,
  });

  const retweets = useQuery({
    queryKey: ["retweets"],
    queryFn: api.getRetweets,
  });

  const combinedData: (PostType | RetweetType)[] = [];
  if (posts.isSuccess && retweets.isSuccess) {
    combinedData.push(...posts.data, ...retweets.data);
    combinedData.sort(
      (a, b) => Number(new Date(b.created_at)) - Number(new Date(a.created_at))
    );
  }

  return (
    <>
      <PageTitle title="Home" />
      <div className="flex justify-between gap-4 border-b-2 items-center border-gray-700 p-4 xs:w-full">
        <div>
          <Image
            src={session?.user?.image ?? ""}
            className="w-14 rounded-full"
            width={40}
            height={40}
            alt="User Image"
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
            className="bg-gray-700 px-6 py-1 rounded-lg text-white"
          >
            Tweet
          </button>
        </div>
      </div>
      <div>
        {posts.isLoading || retweets.isLoading ? (
          <div>Loading...</div>
        ) : (
          combinedData.map((item, index) => {
            if ("postId" in item) {
              const post = posts.data.find(
                (p: PostType) => p.id === item.postId
              );
              const retweetsForPost = retweets.data.filter(
                (r: RetweetType) => r.postId === item.postId
              );
              return (
                <Retweet key={index} post={post} retweets={retweetsForPost} />
              );
            } else {
              return <Post key={index} post={item as PostType} />;
            }
          })
        )}
      </div>
    </>
  );
}
