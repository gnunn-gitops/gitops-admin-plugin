import { AppProjectKind } from '@appproject-model';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import ApplicationListFragment from 'src/application/views/components/ApplicationList/ApplicationListFragment';

type AppProjectAppsProps = RouteComponentProps<{
    ns: string;
    name: string;
}> & {
    obj?: AppProjectKind;
};

const AppProjectAppsPage: React.FC<AppProjectAppsProps> = ({ obj }) => {

    return (
        <ApplicationListFragment
          namespace={obj.metadata.namespace}
          project={obj}
        />
    )
}

export default AppProjectAppsPage;