"use client";
import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import Link from "next/link";
import PageTitle from "@/components/PageTitle";

export default function Notifications() {
  const queryClient = useQueryClient();
  const notifications = useQuery({
    queryKey: ["notifications"],
    queryFn: api.getNotifications,
  });
  const readNotifications = useMutation({
    mutationFn: api.readNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
  useEffect(() => {
    readNotifications.mutate();
  }, []);
  console.log(notifications);

  return (
    <div className="p-4">
      <PageTitle title="Notifications" />

      {notifications.isSuccess ? (
        <div className="flex flex-col gap-4">
          {notifications.data.notifications.map(
            (notification: any, index: any) => (
              <div
                className="p-4 flex justify-between gap-4 border-2 border-b-gray-700 mt-2 rounded-3xl"
                key={index}
              >
                <div>
                  <p>{notification.content}</p>
                  <p className="text-xs">{notification.created_at}</p>
                </div>

                <Link href={`/post/${notification.postId}`}>View post</Link>
              </div>
            )
          )}
        </div>
      ) : null}
    </div>
  );
}
