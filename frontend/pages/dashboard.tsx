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
import useSWR from "swr";
import Sidebar from "../components/sidebar";
import Scratchpad from "../components/scratchpad";
import IssueCard from "../components/issuecard";

async function fetcher(...arg: any) {
  try {
    const res = await fetch(arg);
    return res.json();
  } catch (err) {
    console.log(err);
  }
}

export default function Dashboard() {
  const [session, loading] = useSession();
  const { data: issueData } = useSWR("/api/issues", fetcher);
  if (session) {
    return (
      <>
        <Head>
          <title>Dashboard</title>
        </Head>
        <Sidebar pageTitle="Dashboard">
          <Stack spacing={4} direction={["column", "row"]}>
            <VStack backgroundColor="gray.700" padding={5} borderRadius={20}>
              <Text fontSize="xl" fontWeight="800">
                Issues
              </Text>
              {issueData ? (
                issueData.output
                  .slice(0, 3)
                  .map((issue: any) => (
                    <IssueCard
                      issueName={issue.title}
                      issueBody={issue.body}
                      issueLabels={issue.labels}
                      issueRepo={issue.html_url}
                      issueNumber={issue.number}
                      issueAvatar={issue.user.avatar_url}
                      issueUser={issue.user.login}
                      key={issue.id}
                    />
                  ))
              ) : (
                <Spinner size="xl" />
              )}
            </VStack>
            <Container backgroundColor="gray.700" padding={5} borderRadius={20}>
              <Scratchpad />
            </Container>
          </Stack>
          <Center mt={5}>
            <Image src="https://github-readme-stats.vercel.app/api?username=anandrajaram21" />
          </Center>
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
