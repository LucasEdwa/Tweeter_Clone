import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";

type RetweetType = {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export default function Retweet({
  post,
  retweets,
}: {
  post: any;
  retweets: RetweetType[];
}) {
  const queryClient = useQueryClient();
  const { data: session } = useSession() as {
    data: {
      user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
      };
    } | null;
  };
  const deleteRetweet = useMutation({
    mutationFn: (retweetId: string) => api.deleteRetweet(retweetId),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  if (!post) return <div>Post is required.</div>;

  return (
    <div className="flex flex-col bg-gray-700/20 p-8 rounded-3xl xs:p-0">
      <div className="items-center">
        {retweets &&
          retweets.map((retweet, index) => {
            const isRetweetOwner = session?.user?.id === retweet.user.id;
            return (
              <div key={index} className="mt-4 ">
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <Image
                      src={retweet.user.image || "/default-profile.png"}
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
                  {isRetweetOwner && (
                    <button
                      onClick={() => deleteRetweet.mutate(retweet.id)}
                      className="text-red-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-trash-2"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" x2="10" y1="11" y2="17"></line>
                        <line x1="14" x2="14" y1="11" y2="17"></line>
                      </svg>
                    </button>
                  )}
                </div>
                <p className="mt-2">{retweet.content}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
