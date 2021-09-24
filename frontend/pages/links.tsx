import ExternalLink from "../components/externallink";
import Sidebar from "../components/sidebar";
import Head from "next/head";

export default function Links() {
  return (
    <>
      <Head>
        <title>Important Links</title>
      </Head>
      <Sidebar pageTitle="Important Links">
        <ExternalLink
          linkUrl="https://mlh-fellowship.gitbook.io/fellow-handbook/"
          linkName="Fellow Handbook"
        />
        <ExternalLink
          linkUrl="https://mlh-fellowship.trainualapp.com/"
          linkName="Trainual"
        />
        <ExternalLink
          linkUrl="https://mlh-fellowship.topicbox.com/"
          linkName="Topicbox"
        />
      </Sidebar>
    </>
  );
}
