"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useParams, redirect } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Profile() {
  const params = useParams();
  const { data: session } = useSession();

  const user = useQuery({
    queryKey: ["user", params.userId],
    queryFn: () => {
      return api.getUser(params.userId as string);
    },
  });

  const followUser = useMutation({
    mutationFn: () => {
      return api.followUser(params.userId as string);
    },
    onSuccess: () => {
      // Refetch the user query after a successful follow/unfollow
      user.refetch();
    },
  });

  if (user.isError) {
    return redirect("/app");
  }
  if (user.isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {user.isLoading ? <div> Loading...</div> : null}
      {user.isError ? <div> Error...</div> : null}
      {user.isSuccess ? (
        <div className="flex justify-between items-center p-4 border-b border-gray-900 ">
          <div className="flex items-center  gap-4">
            <Image
              src={user?.data?.userWithFollowing?.image}
              width={100}
              height={100}
              className="w-24 rounded-full"
              alt="User Profile Image"
            />
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-semibold">
                {user?.data?.userWithFollowing?.name}
              </h1>
              <p className="">{user?.data?.userWithFollowing?.email}</p>
            </div>
          </div>
          <div className="flex gap-4 flex-col w-1/4 p-2">
            <div className="flex gap-4">
              <div className="text-center">
                <h3 className="font-semibold">
                  {user?.data?.userWithFollowing?.followed.length}
                </h3>
                <h4>Followers</h4>
              </div>
              <div className="text-center">
                <h3 className="font-semibold">
                  {user?.data?.userWithFollowing?.following.length}
                </h3>
                <h4>Following</h4>
              </div>
            </div>
            {user.data?.userWithFollowing?.email === session?.user?.email ? (
              <button className="bg-blue-400 p-1 text-white rounded-full hover:bg-blue-500">
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => followUser.mutate()}
                className="bg-blue-400 p-1 text-white rounded-full hover:bg-blue-500"
              >
                {user.data?.userWithFollowing?.isFollowing
                  ? "Unfollow"
                  : "Follow"}
              </button>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
