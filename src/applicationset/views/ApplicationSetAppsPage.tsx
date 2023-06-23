import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import ApplicationListFragment from 'src/application/views/components/ApplicationList/ApplicationListFragment';

type AppSetAppsProps = RouteComponentProps<{
    ns: string;
    name: string;
}> & {
    obj?: K8sResourceCommon;
};

const AppSetAppsPage: React.FC<AppSetAppsProps> = ({ obj }) => {

    return (
        <ApplicationListFragment
          namespace={obj.metadata.namespace}
          appset={obj}
        />
    )
}

export default AppSetAppsPage;