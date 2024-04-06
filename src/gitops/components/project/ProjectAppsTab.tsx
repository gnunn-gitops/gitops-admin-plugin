import { AppProjectKind } from '@gitops-models/AppProjectModel';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import ApplicationListFragment from '@gitops-shared/ApplicationList';

type ProjectAppsProps = RouteComponentProps<{
    ns: string;
    name: string;
}> & {
    obj?: AppProjectKind;
};

const ProjectAppsPage: React.FC<ProjectAppsProps> = ({ obj }) => {

    return (
        <ApplicationListFragment
          namespace={obj.metadata.namespace}
          project={obj}
        />
    )
}

export default ProjectAppsPage;
