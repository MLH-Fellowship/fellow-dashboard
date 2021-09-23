import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/client";
import Sidebar from "../components/sidebar";

export default function Dashboard() {
  const [session, loading] = useSession();
  if (session) {
    return (
      <>
        <Head>
          <title>Dashboard</title>
        </Head>
        <Sidebar pageTitle="Dashboard">
          <div>
            <h1>Dashboard</h1>
            <Link href="/">
              <a>Home</a>
            </Link>
          </div>
        </Sidebar>
      </>
    );
  }

  return (
    <Sidebar pageTitle="Dashboard">
      <h1>Not Signed In</h1>
    </Sidebar>
  );
}
