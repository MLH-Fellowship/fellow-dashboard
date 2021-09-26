import { useState, useEffect } from "react";
import { VStack, Text, Spinner } from "@chakra-ui/react";
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
      <Text fontSize="xl" fontWeight="800">
        Issues
      </Text>
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
