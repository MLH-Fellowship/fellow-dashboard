import { Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export default function ExternalLink({ linkName, linkUrl }) {
  return (
    <>
      <Link href={linkUrl} isExternal>
        {linkName} <ExternalLinkIcon mx={2} />
      </Link>
      <br />
    </>
  );
}
