import Head from "next/head";
import { useSession } from "next-auth/client";
import {
  Stack,
  Container,
  Image,
  Center,
  VStack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import Sidebar from "../components/sidebar";
import Scratchpad from "../components/scratchpad";
import IssueCard from "../components/issuecard";
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
            <Discussions />
            <Container backgroundColor="gray.700" padding={5} borderRadius={20}>
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
