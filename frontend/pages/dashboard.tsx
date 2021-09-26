import Head from "next/head";
import { useSession } from "next-auth/client";
import { Stack, Container, Heading, Center, Text } from "@chakra-ui/react";
import Sidebar from "../components/sidebar";
import Scratchpad from "../components/scratchpad";
import Issues from "../components/issues";

export default function Dashboard() {
  const [session, loading] = useSession();
  if (session) {
    return (
      <>
        <Head>
          <title>Dashboard</title>
        </Head>
        <Sidebar pageTitle="Dashboard">
          <Stack spacing={2} direction={["column", "row"]}>
            <Container>
              <Center>
                <Heading>Standup Notes</Heading>
              </Center>
              <Center>
                <Text fontSize="xs">(psst you can edit this)</Text>
              </Center>
              <Container
                padding={5}
                borderRadius="lg"
                backgroundColor="gray.700"
                mt={2}
              >
                <Scratchpad />
              </Container>
            </Container>
            <Container>
              <Issues />
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
