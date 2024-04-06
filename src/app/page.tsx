import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";
import { getToken } from "next-auth/jwt";
import { User } from "./userInfo";

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main>
      <div>Server Data</div>
      <pre>{JSON.stringify(session)}</pre>
      <div>Client Data</div>
      <User />
    </main>
  );
}
