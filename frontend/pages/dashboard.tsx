import Head from "next/head";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      <h1>Dashboard</h1>
      <Link href="/">
        <a>Home</a>
      </Link>
    </div>
  );
}
