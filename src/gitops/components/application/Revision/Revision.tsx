import { createRevisionURL } from 'src/gitops/utils/gitops';
import * as React from 'react';
import ExternalLink from '@gitops-shared/ExternalLink';

interface RevisionProps {
    repoURL: string;
    revision: string;
    helm: boolean;
}

const Revision: React.FC<RevisionProps> = ({ repoURL, revision, helm }) => {
    if (revision) {
        return (
            (
                <div>
                    {!helm &&
                        <ExternalLink href={createRevisionURL(repoURL, revision)}>
                            {revision.substring(0, 7) || ''}
                        </ExternalLink>
                    }
                    {helm &&
                        <span>{ revision }</span>
                    }
                </div>
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

export default Revision;
