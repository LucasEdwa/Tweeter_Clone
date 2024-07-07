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
          <img
            className="w-10  bg-slate-100/80 rounded-full"
            src="https://www.freeiconspng.com/uploads/real-homepage-icon-png-12.png"
            alt="no pic"
          />
          <span className=" xs:hidden">Home</span>
        </Link>
        <Link
          className="text-xl font-semibold flex items-center gap-4"
          href={user.isSuccess ? "/app/profile/" + user.data.user.id : "/app"}
        >
          <img
            className="w-10  rounded-full"
            src="https://www.freeiconspng.com/uploads/account-profile-icon-1.png"
            alt="no pic"
          />
          <span className=" xs:hidden">Profile</span>
        </Link>
        <Link
          className="text-xl font-semibold flex items-center gap-4 xs:relative"
          href="/app/notifications"
        >
          <img
            className="w-10  rounded-full"
            src="https://www.freeiconspng.com/uploads/message-icon-png-13.png"
            alt="no pic"
          />
          <div className="absolute mb-10 bg-red-500 rounded-2xl text-sm">
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
          <img
            className="w-10  rounded-full"
            src="https://www.freeiconspng.com/uploads/door-exit-log-out-logout-sign-out-icon--8.png"
          />
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
            className="rounded-full xs:hidden "
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKFin1Oye3SHZ-goPId1ya8y6NDzuBloHq8Q&usqp=CAU"
          />
        </div>
      </nav>
    </>
  );
}
