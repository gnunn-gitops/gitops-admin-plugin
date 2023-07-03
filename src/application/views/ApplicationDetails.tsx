import * as React from 'react';

import {
  HorizontalNav,
  K8sResourceCommon,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';

import ApplicationDetailsPage from './ApplicationDetailsPage';
import ApplicationResourcesPage from './ApplicationResourcesPage';
import ApplicationYAMLPage from './ApplicationYAMLPage';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import ApplicationSyncStatusPage from './ApplicationSycnStatusPage';
import { useApplicationActionsProvider } from './hooks/useApplicationActionsProvider';
import PageTitle from '@shared/views/components/PageTitle/PageTitle';
import { ApplicationModel } from '@application-model';

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

  const [actions /*, onLazyOpen*/] = useApplicationActionsProvider(application);

  const pages = React.useMemo(
    () => [
      {
        href: '',
        name: t('Details'),
        component: ApplicationDetailsPage,
      },
      {
        href: 'yaml',
        name: t('YAML'),
        component: ApplicationYAMLPage,
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
    ],
    [],
  );

  return (
    <>
      <PageTitle obj={application} model={ApplicationModel} namespace={namespace} name={name} actions={actions}/>
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
