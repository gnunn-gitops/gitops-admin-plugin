//import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Generators from './Generators';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { ApplicationSetKind } from '@gitops-models/ApplicationSetModel';
import { PageSection } from '@patternfly/react-core';

type AppSetGeneratorsProps = RouteComponentProps<{
    ns: string;
    name: string;
}> & {
    obj?: K8sResourceCommon;
};

const AppSetGeneratorsTab: React.FC<AppSetGeneratorsProps> = ({ obj }) => {
    console.log(obj)
    var appset:ApplicationSetKind = obj as ApplicationSetKind;

    return (
        <PageSection>
            {appset?.spec?.generators &&
                <Generators generators={appset.spec.generators}/>
            }
        </PageSection>
    )
}

export default AppSetGeneratorsTab;
