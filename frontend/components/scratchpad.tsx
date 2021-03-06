import Prism from "prismjs";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { Text, createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { css } from "@emotion/css";
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Get, Post } from "../utils/network";
import { useSession, getSession } from "next-auth/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// eslint-disable-next-line
Prism.languages.markdown=Prism.languages.extend("markup",{}),Prism.languages.insertBefore("markdown","prolog",{blockquote:{pattern:/^>(?:[\t ]*>)*/m,alias:"punctuation"},code:[{pattern:/^(?: {4}|\t).+/m,alias:"keyword"},{pattern:/``.+?``|`[^`\n]+`/,alias:"keyword"}],title:[{pattern:/\w+.*(?:\r?\n|\r)(?:==+|--+)/,alias:"important",inside:{punctuation:/==+$|--+$/}},{pattern:/(^\s*)#+.+/m,lookbehind:!0,alias:"important",inside:{punctuation:/^#+|#+$/}}],hr:{pattern:/(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,lookbehind:!0,alias:"punctuation"},list:{pattern:/(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,lookbehind:!0,alias:"punctuation"},"url-reference":{pattern:/!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,inside:{variable:{pattern:/^(!?\[)[^\]]+/,lookbehind:!0},string:/(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,punctuation:/^[\[\]!:]|[<>]/},alias:"url"},bold:{pattern:/(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^\*\*|^__|\*\*$|__$/}},italic:{pattern:/(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^[*_]|[*_]$/}},url:{pattern:/!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,inside:{variable:{pattern:/(!?\[)[^\]]+(?=\]$)/,lookbehind:!0},string:{pattern:/"(?:\\.|[^"\\])*"(?=\)$)/}}}}),Prism.languages.markdown.bold.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.italic.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.bold.inside.italic=Prism.util.clone(Prism.languages.markdown.italic),Prism.languages.markdown.italic.inside.bold=Prism.util.clone(Prism.languages.markdown.bold); // prettier-ignore

const convertContentToString = (content: any) => {
  let text = "";
  for (const item of content) {
    text += "\\n" + item.children[0].text + "  \\n";
  }
  return text;
};

const postStandup = async (slug: string) => {
  const session = await getSession();
  const id = btoa(session.user.email);
  const response = await Get(`/scratchpad/${id}`);
  const content = response.data[id];
  const convertedContent = convertContentToString(JSON.parse(content));
  console.log(convertedContent);
  const standupResponse = await Post(
    { text: convertedContent },
    `/github/standup/${slug}/${session.accessToken}`
  );
  console.log(standupResponse);
};

const saveScratchpad = async (id) => {
  const content = await localStorage.getItem("content");
  const response = await Post({ text: content }, `/scratchpad/${id}`);
  console.log(response);
};

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "**What did you achieve in the last 24 hours?**:" }],
  },
  {
    type: "paragraph",
    children: [{ text: "- First" }],
  },
  {
    type: "paragraph",
    children: [{ text: "- Second" }],
  },
  {
    type: "paragraph",
    children: [
      { text: "**What are your priorities for the next 24 hours?**:" },
    ],
  },
  {
    type: "paragraph",
    children: [{ text: "- First" }],
  },
  {
    type: "paragraph",
    children: [{ text: "- Second" }],
  },
  {
    type: "paragraph",
    children: [{ text: "**Blockers**:" }],
  },
  {
    type: "paragraph",
    children: [{ text: "- First" }],
  },
  {
    type: "paragraph",
    children: [{ text: "- Second" }],
  },
  {
    type: "paragraph",
    children: [{ text: "**Shoutouts**:" }],
  },
  {
    type: "paragraph",
    children: [{ text: "- First" }],
  },
  {
    type: "paragraph",
    children: [{ text: "- Second" }],
  },
];

const Scratchpad = () => {
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [session, loading] = useSession();
  const [podList, setPodList] = useState([]);
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const notify = (message: string) => toast(message);
  const decorate = useCallback(([node, path]) => {
    const ranges = [];

    if (!Text.isText(node)) {
      return ranges;
    }

    const getLength = (token) => {
      if (typeof token === "string") {
        return token.length;
      } else if (typeof token.content === "string") {
        return token.content.length;
      } else {
        return token.content.reduce((l, t) => l + getLength(t), 0);
      }
    };

    const tokens = Prism.tokenize(node.text, Prism.languages.markdown);
    let start = 0;

    for (const token of tokens) {
      const length = getLength(token);
      const end = start + length;

      if (typeof token !== "string") {
        ranges.push({
          [token.type]: true,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        });
      }

      start = end;
    }

    return ranges;
  }, []);

  useEffect(() => {
    async function getScratchpad() {
      const session = await getSession();
      const id = btoa(session.user.email);
      const response = await Get(`/scratchpad/${id}`);
      const retValue = response.data[id];
      if (retValue) {
        setValue(JSON.parse(retValue));
      }
    }

    async function getPods() {
      const session = await getSession();
      const response = await Get(`/github/list-pods/${session.accessToken}`);
      setPodList(response.data);
    }

    getScratchpad();
    getPods();
  }, []);

  return (
    <>
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => {
          setValue(value);

          // Save the value to Local Storage.
          const content = JSON.stringify(value);
          localStorage.setItem("content", content);
        }}
      >
        <Editable
          decorate={decorate}
          renderLeaf={renderLeaf}
          placeholder="Write some markdown..."
        />
      </Slate>
      <HStack marginTop={5}>
        <Button
          colorScheme="gray"
          onClick={async () => {
            await saveScratchpad(btoa(session.user.email));
            notify("Notes saved to Database");
          }}
        >
          Save
        </Button>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            colorScheme="blue"
          >
            Submit Standup to:
          </MenuButton>
          <MenuList>
            {podList.map((pod) => (
              <MenuItem
                key={pod.slug}
                onClick={() => {
                  postStandup(pod.slug);
                  notify("Standup Message Posted!");
                }}
              >
                {pod.name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </HStack>
      <ToastContainer />
    </>
  );
};

const Leaf = ({ attributes, children, leaf }) => {
  return (
    <span
      {...attributes}
      className={css`
        font-weight: ${leaf.bold && "bold"};
        font-style: ${leaf.italic && "italic"};
        text-decoration: ${leaf.underlined && "underline"};
        ${leaf.title &&
        css`
          display: inline-block;
          font-weight: bold;
          font-size: 20px;
          margin: 20px 0 10px 0;
        `}
        ${leaf.list &&
        css`
          padding-left: 10px;
          font-size: 20px;
          line-height: 10px;
        `}
        ${leaf.hr &&
        css`
          display: block;
          text-align: center;
          border-bottom: 2px solid #ddd;
        `}
        ${leaf.blockquote &&
        css`
          display: inline-block;
          border-left: 2px solid #ddd;
          padding-left: 10px;
          color: #aaa;
          font-style: italic;
        `}
        ${leaf.code &&
        css`
          font-family: monospace;
          background-color: #eee;
          padding: 3px;
        `}
      `}
    >
      {children}
    </span>
  );
};

export default Scratchpad;
