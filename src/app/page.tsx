import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main>
      <div>Test Data</div>
      <pre>{JSON.stringify(session)}</pre>
    </main>
  );
}
