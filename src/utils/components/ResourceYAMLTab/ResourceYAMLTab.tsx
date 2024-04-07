import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { K8sResourceCommon, ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';

type ResourceYAMLTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: K8sResourceCommon;
};

const ResourceYAMLTab: React.FC<ResourceYAMLTabProps> = ({ obj }) => {
  return (
    <ResourceYAMLEditor initialResource={obj} header={obj?.kind} />
  );
};

export default ResourceYAMLTab;
