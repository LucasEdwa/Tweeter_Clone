"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useParams, redirect } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Post from "@/components/Post";

export default function PostPage() {
  const params = useParams();
  const post = useQuery({
    queryKey: ["post", params.postId],
    queryFn: () => api.getPost(params.postId as string),
  });

  return (
    <>{post.isSuccess ? <Post post={post.data} /> : <div>Loading...</div>}</>
  );
}
