import * as React from 'react';

import {
  HorizontalNav,
  K8sResourceCommon,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';

import ApplicationPageTitle from './ApplicationDetails/ApplicationPageTitle';
import ApplicationDetailsPage from './ApplicationDetailsPage';
import ApplicationResourcesPage from './ApplicationResourcesPage';
import ApplicationYAMLPage from './ApplicationYAMLPage';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import ApplicationSyncStatusPage from './ApplicationSycnStatusPage';

type ApplicationPageProps = {
  name: string;
  namespace: string;
  kind: string;
};

const ApplicationNavPage: React.FC<ApplicationPageProps> = ({ name, namespace, kind }) => {
  const { t } = useGitOpsTranslation();
  const [application, loaded] = useK8sWatchResource<K8sResourceCommon>({
    groupVersionKind: {
      group: "argoproj.io",
      kind: "Application",
      version: "v1alpha1"
    },
    kind,
    name,
    namespace,
  });

  const pages = React.useMemo(
    () => [
      {
        href: '',
        name: t('Details'),
        component: ApplicationDetailsPage,
      },
      {
        href: 'resources',
        name: t('Resources'),
        component: ApplicationResourcesPage,
      },
      {
        href: 'syncStatus',
        name: t('Sync Status'),
        component: ApplicationSyncStatusPage,
      },
      {
        href: 'yaml',
        name: t('YAML'),
        component: ApplicationYAMLPage,
      },
    ],
    [],
  );

  return (
    <>
      <ApplicationPageTitle application={application} namespace={namespace} name={name} />
      {loaded ? (
        <HorizontalNav pages={pages} resource={application} />
      ) : (
        <Bullseye>
          <Spinner isSVG size='xl' />
        </Bullseye>
      )}
    </>
  );
};

export default ApplicationNavPage;
