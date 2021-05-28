// @flow
import useWindowScrollPosition from "@rehooks/window-scroll-position";
import * as React from "react";
import styled from "styled-components";
import breakpoint from "styled-components-breakpoint";
import HelpText from "components/HelpText";

const HEADING_OFFSET = 20;

type Props = {
  headings: { title: string, level: number, url: string }[],
};

export default function ShareTable({ headings, shareId }: Props) {

  // calculate the minimum heading level and adjust all the headings to make
  // that the top-most. This prevents the contents from being weirdly indented
  // if all of the headings in the document are level 3, for example.
  const minHeading = headings.reduce(
    (memo, heading) => (heading.level < memo ? heading.level : memo),
    Infinity
  );
  const headingAdjustment = minHeading - 1;

  return (
    <>
      <Wrapper>
        <Heading>Table of contents</Heading>
        {headings.length ? (
          <List>
            {headings.map((heading) => (
              <ListItem
                key={heading.url}
                level={heading.level - headingAdjustment}
                active={shareId === heading.url}
              >
                <Link href={`/share/${heading.url}`}>{heading.level > 1 ? '•' : ''} {heading.title}</Link>
              </ListItem>
            ))}
          </List>
        ) : (
          <Empty>Table of other shared documents will appear here</Empty>
        )}
      </Wrapper>
    </>
  );
}

const Wrapper = styled("div")`
  top: 0;
  bottom: 0;
  width: 100%;

  max-width: 15%;
  min-width: 280px;
  padding: 50px;

  #border-right: 1px solid grey;
  background-color: ghostwhite;
`;

const Heading = styled("h3")`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${(props) => props.theme.sidebarText};
  letter-spacing: 0.04em;
`;

const Empty = styled(HelpText)`
  margin: 1em 0 4em;
  padding-right: 2em;
  min-width: 16em;
  width: 16em;
  font-size: 14px;
`;

const ListItem = styled("li")`
  margin-left: ${(props) => (props.level - 1) * 10}px;
  margin-bottom: 8px;
  padding-right: 2em;
  line-height: 1.3;
  border-right: 4px solid
    ${(props) => (props.active ? props.theme.divider : "transparent")};
`;

const Link = styled("a")`
  color: ${(props) => props.theme.text};
  font-size: 14px;

  &:hover {
    color: ${(props) => props.theme.primary};
  }
`;

const List = styled("ol")`
  min-width: 14em;
  width: 14em;
  padding: 0;
  list-style: none;
`;
