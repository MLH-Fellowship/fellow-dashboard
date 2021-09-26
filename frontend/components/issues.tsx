import { useState, useEffect } from "react";
import { VStack, Heading, Spinner } from "@chakra-ui/react";
import { getSession } from "next-auth/client";
import { Get } from "../utils/network";
import IssueCard from "./issuecard";

export default function Issues() {
  const [issueData, setIssueData] = useState([]);

  useEffect(() => {
    async function getIssues() {
      const session = await getSession();
      const response = await Get(
        `/github/issues/assigned/${session.accessToken}`
      );
      setIssueData(response.data);
    }

    getIssues();
  });

  return (
    <VStack>
      <Heading>Issues</Heading>
      {issueData ? (
        issueData
          .slice(0, 3)
          .map((issue: any) => (
            <IssueCard
              issueName={issue.title}
              issueBody={issue.body}
              issueLabels={issue.labels}
              issueRepo={issue.html_url}
              issueNumber={issue.number}
              issueAvatar={issue.avatar_url}
              issueUser={issue.login}
              key={issue.id}
            />
          ))
      ) : (
        <Spinner size="xl" />
      )}
    </VStack>
  );
}
