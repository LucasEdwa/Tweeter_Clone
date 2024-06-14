"use client"
import {signOut} from "next-auth/react"

import {useQuery} from "@tanstack/react-query";

import Link from "next/link"
import api from "@/lib/axios";



export default function Navigation(){

  
    const user = useQuery({
      queryKey:["user"],
      queryFn: api.getCurrentUser
    });

    if(user.isLoading){
      return(<div>Loading....</div>);
    }

    return(<>
        <nav className="p-8 flex flex-col gap-4">
            <div className="w-full bg-slate-400/80 p-4 rounded-xl flex justify-between items-center">
                <img src="https://www.freeiconspng.com/uploads/twitter-icon-8.png"
                    className="w-10 "
                />
                <p  className="p-4 font-semibold text-black ">What is going on?</p>
            </div>
          <Link className="text-xl font-semibold flex items-center gap-4" href="#">
            <img className="w-10  bg-slate-100/80 rounded-full" src="https://www.freeiconspng.com/uploads/real-homepage-icon-png-12.png" alt="no pic"/>
             Home</Link>
             <Link className="text-xl font-semibold flex items-center gap-4" href={user.isSuccess ? "/app/profile/" + user.data.user.id : "/app"}>
            <img className="w-10  rounded-full" src="https://www.freeiconspng.com/uploads/account-profile-icon-1.png" alt="no pic" />
             Profile</Link>
          <Link className="text-xl font-semibold flex items-center gap-4" href="#">
            <img className="w-10  rounded-full" src="https://www.freeiconspng.com/uploads/message-icon-png-13.png" alt="no pic" />
             Notifications</Link>

          <button className="text-xl font-semibold text-left flex gap-4" onClick={()=> signOut()}><img className="w-10  rounded-full" src="https://www.freeiconspng.com/uploads/door-exit-log-out-logout-sign-out-icon--8.png"/>SignOut</button>
          <Link className="bg-blue-400  rounded-full text-white p-2 text-center hover:bg-blue-500"  href="/app">Tweet</Link>
          <div className="p-4 mt-20">
              <img className="rounded-full " src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKFin1Oye3SHZ-goPId1ya8y6NDzuBloHq8Q&usqp=CAU" />
          </div>
        </nav>
    </>)
}