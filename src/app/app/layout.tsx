import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Navigation from "@/components/Navigation";

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
    <div className="grid grid-cols-4">
      <div>
        <Navigation />
      </div>
      <div className="col-span-2 border-x-2 border-gray-900 h-screen">
        {children}
      </div>
      <div>Search field</div>
    </div>
  );
}
