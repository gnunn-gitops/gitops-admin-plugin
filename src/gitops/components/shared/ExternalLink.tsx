import * as React from 'react';
import { ReactNode } from 'react';
import { Text } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';


type ExternalLinkProps = {
  href?: string;
  children?: ReactNode;
};

const ExternalLink = ({ href, children }: ExternalLinkProps) => (
  <Text component="a" href={href} target="_blank" rel="noopener noreferrer">
    {children ? children : href} <ExternalLinkAltIcon />
  </Text>
);
export default ExternalLink;
