"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/lib/axios";
import Image from "next/image";

export default function Search() {
  const [searchData, setSearchData] = useState("");
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const searchUsers = useMutation({
    mutationFn: () => api.searchUsers({ content: searchData }),
  });

  // Effect to add and remove the event listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node)
      ) {
        setSearchData(""); // Clear search data to hide results
      }
    }

    // Add click event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchResultsRef]);

  return (
    <div className="flex flex-col p-4 gap-4 xs:justify-between">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search for users"
          value={searchData} // Ensure the input is controlled
          onChange={(e) => setSearchData(e.target.value)}
          className="xs:p-0 xs:w-full border-2 border-gray-700 bg-gray-400 rounded-full py-2 px-4 outline-none w-full placeholder-gray-500"
        />
        <button
          onClick={() => searchUsers.mutate()}
          className="bg-gray-700 text-white p-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {searchData && searchUsers.isSuccess && (
        <div ref={searchResultsRef} className="xs:bg-black">
          <p className="text-gray-700">Search results:</p>
          {searchUsers.data.length > 0 ? (
            searchUsers.data.map((user: any, index: any) => (
              <div key={index} className="flex gap-2">
                <Link
                  href={"/app/profile/" + user.id}
                  className="text-gray-300 text-bold flex items-center gap-4 w-full hover:text-gray-400 border-b-2 border-gray-700 p-2"
                >
                  <Image
                    src={user.image}
                    className="w-14 h-14 rounded-full"
                    alt="user"
                    width={40}
                    height={40}
                  />
                  {user.name}
                </Link>
              </div>
            ))
          ) : (
            <div>No users found.</div>
          )}
        </div>
      )}
    </div>
  );
}
