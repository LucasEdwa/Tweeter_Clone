import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Navigation from "@/components/Navigation";
import Search from "@/components/Search";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/");
  }
  return (
    <div className="grid grid-cols-4 xs:flex ">
      <div className="xs:p-2">
        <Navigation />
      </div>
      <div className="col-span-2 border-x-2  border-gray-900 min-h-screen xs:w-full h-full">
        {children}
      </div>
      <div className="xs:absolute xs-top-0 xs:right-0">
        <Search />
      </div>
    </div>
  );
}
