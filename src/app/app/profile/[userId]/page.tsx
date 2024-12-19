"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useParams, redirect } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Post from "@/components/Post";
import PageTitle from "@/components/PageTitle";
import Retweet from "@/components/Retweet";

export default function Profile() {
  const params = useParams();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const user = useQuery({
    queryKey: ["user", params.userId],
    queryFn: () => api.getUser(params.userId as string),
  });

  const posts = useQuery({
    queryKey: ["posts", params.userId],
    queryFn: () => api.getUserPosts(params.userId as string),
  });

  const retweets = useQuery({
    queryKey: ["retweets"],
    queryFn: api.getRetweets,
  });

  const followUser = useMutation({
    mutationFn: () => api.followUser(params.userId as string),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  if (user.isError) {
    return redirect("/app");
  }

  if (user.isLoading) {
    return <div>Loading...</div>;
  }

  const filteredRetweets = retweets.isSuccess
    ? retweets.data.filter((retweet: any) => retweet.userId === params.userId)
    : [];

  const combinedData = [];
  if (posts.isSuccess && retweets.isSuccess) {
    combinedData.push(...posts.data, ...filteredRetweets);
    combinedData.sort(
      (a, b) => Number(new Date(b.created_at)) - Number(new Date(a.created_at))
    );
  }
  console.log(combinedData);
  return (
    <>
      <PageTitle title="Profile" />

      {user.isLoading ? <div>Loading...</div> : null}
      {user.isError ? <div>Error...</div> : null}
      {user.isSuccess && (
        <div className="flex justify-between items-center p-4 border-b border-gray-900">
          <div className="flex items-center gap-4">
            <Image
              src={user.data.image}
              width={100}
              height={100}
              className="w-16 rounded-full"
              alt="User Profile Image"
            />
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-semibold">{user.data.name}</h1>
              <p>{user.data.email}</p>
            </div>
          </div>
          <div className="flex gap-4 flex-col w-1/4 text-sm">
            <div className="flex gap-4 justify-center">
              <div className="text-center">
                <h3 className="font-semibold">{user.data.followed.length}</h3>
                <h4>Followers</h4>
              </div>
              <div className="text-center">
                <h3 className="font-semibold">{user.data.following.length}</h3>
                <h4>Following</h4>
              </div>
            </div>
            {user.data.email === session?.user?.email ? (
              <button className="bg-blue-400 p-1 text-white rounded-full hover:bg-blue-500">
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => followUser.mutate()}
                className="bg-blue-400 p-1 text-white rounded-full hover:bg-blue-500"
              >
                {user.data.isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>
      )}

      {posts.isLoading || retweets.isLoading ? (
        <div>Loading posts and retweets...</div>
      ) : posts.isError || retweets.isError ? (
        <div>Error loading posts or retweets...</div>
      ) : combinedData.length > 0 ? (
        <>
          {combinedData.map((item, index) => {
            if ("postId" in item) {
              const post = posts.data.find((p: any) => p.id === item.postId);
              const retweetsForPost = retweets.data.filter(
                (r: any) => r.postId === item.postId
              );
              return (
                <Retweet key={index} post={post} retweets={retweetsForPost} />
              );
            } else {
              return <Post key={index} post={item} />;
            }
          })}
        </>
      ) : (
        <div>No posts or retweets available.</div>
      )}
    </>
  );
}
