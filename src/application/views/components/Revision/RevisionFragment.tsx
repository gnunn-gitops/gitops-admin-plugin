import { createRevisionURL } from '@gitops-utils/gitops';
import * as React from 'react';
import ExternalLink from '../ExternalLink/ExternalLink';

interface RevisionProps {
    repoURL: string;
    revision: string;
}

const RevisionFragment: React.FC<RevisionProps> = ({ repoURL, revision }) => {
    if (revision) {
        return (
            (
                <ExternalLink href={createRevisionURL(repoURL, revision)}>
                    {revision.substring(0,7) || ''}
                </ExternalLink>
            )
        )
    } else {
      return (
        (
            <span>None</span>
        )
      )
    }
};

export default RevisionFragment;
