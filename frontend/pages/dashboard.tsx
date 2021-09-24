import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/client";
import { Stack, Container } from "@chakra-ui/react";

import Sidebar from "../components/sidebar";
import Scratchpad from "../components/scratchpad";
import Discussions from "../components/discussions";

export default function Dashboard() {
  const [session, loading] = useSession();
  if (session) {
    return (
      <>
        <Head>
          <title>Dashboard</title>
        </Head>
        <Sidebar pageTitle="Dashboard">
          <Stack spacing={4} direction={["column", "row"]}>
            <Container backgroundColor="gray.700" padding={5}>
              <Discussions />
            </Container>
            <Container backgroundColor="gray.700" padding={5}>
              <Scratchpad />
            </Container>
          </Stack>
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
