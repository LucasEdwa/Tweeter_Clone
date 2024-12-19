"use client";
import { signOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/lib/axios";

export default function Navigation() {
  const user = useQuery({
    queryKey: ["user"],
    queryFn: api.getCurrentUser,
  });
  const unreadNotifications = useQuery({
    queryKey: ["unread-notifications"],
    queryFn: api.getUnreadNotifications,
  });

  if (user.isLoading) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <nav className="p-8 xs:p-0  flex flex-col xs:w-fit gap-4  ">
        <div className=" bg-slate-400/80 p-4   rounded-xl flex justify-between items-center">
          <img
            src="https://www.freeiconspng.com/uploads/twitter-icon-8.png"
            className="w-10 xs:object-cover xs:w-5 "
          />
          <p className="p-4 font-semibold text-black xs:hidden ">
            What is going on?
          </p>
        </div>
        <Link
          className="text-xl font-semibold flex items-center gap-4"
          href="/app"
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
            className="lucide lucide-house"
          >
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          <span className=" xs:hidden">Home</span>
        </Link>
        <Link
          className="text-xl font-semibold flex items-center gap-4"
          href={user.isSuccess ? "/app/profile/" + user.data.user.id : "/app"}
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
            className="lucide lucide-user-round-pen"
          >
            <path d="M2 21a8 8 0 0 1 10.821-7.487" />
            <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
            <circle cx="10" cy="8" r="5" />
          </svg>
          <span className=" xs:hidden">Profile</span>
        </Link>
        <Link
          className="text-xl font-semibold flex items-center gap-4 xs:relative"
          href="/app/notifications"
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
            className="lucide lucide-bell"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <div className="absolute mb-8  rounded-2xl text-sm">
            {unreadNotifications.isSuccess
              ? unreadNotifications.data.notifications
              : 0}{" "}
          </div>{" "}
          <span className=" xs:hidden">Notifications</span>
        </Link>

        <button
          className="text-xl font-semibold text-left flex gap-4"
          onClick={() => signOut()}
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
            className="lucide lucide-log-out"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          <span className=" xs:hidden">Logout</span>
        </button>
        <Link
          className="bg-gray-700 xs:hidden rounded-full text-white p-2 text-center hover:bg-gray-800"
          href="/app"
        >
          Tweet
        </Link>
        <div className="p-4 mt-20">
          <img
            className="rounded-full xs:hidden hover:animate-bounce "
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKFin1Oye3SHZ-goPId1ya8y6NDzuBloHq8Q&usqp=CAU"
          />
        </div>
      </nav>
    </>
  );
}
