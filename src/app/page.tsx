"use client"

import {signIn, signOut, useSession} from "next-auth/react";
import {redirect} from "next/navigation"
export default function Home() {
  const { data: session } = useSession();

  if (session){
    return redirect('/app')
  }

  return (
    <>
       <div className="flex justify-center mt-20">
        <div className="flex flex-col text-center  gap-4">
         <div className="flex justify-center">
          <img src="https://www.freeiconspng.com/uploads/twitter-icon-8.png"
            className="w-12 "
            />
         </div>

         <h1 className="text-4xl font-semibold">Happening now</h1>
         <h2 className="text-xl">Join today</h2>
         <button className="bg-blue-400  rounded-full text-white p-2 hover:bg-blue-500" onClick={()=> signIn('github')} >Sign In with GitHub</button>
         <p>
          Don´t have a GitHub account yet? Sign up <a href="https://github.com" target="_blank" className="underline hover:text-blue-500 hover:rounded-xl hover:p-[1.5px]">here</a>
         </p>
         </div>
        
       </div>

    </>
  );
}
