import * as React from 'react';

import {
  HorizontalNav,
  K8sResourceCommon,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';

import ApplicationDetailsTab from './ApplicationDetailsTab';
import ApplicationResourcesTab from './ApplicationResourcesTab';
import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import ApplicationSyncStatusTab from './ApplicationSycnStatusTab';
import { useApplicationActionsProvider } from './hooks/useApplicationActionsProvider';
import PageTitle from '@utils/components/PageTitle/PageTitle';
import { ApplicationModel } from '@gitops-models/ApplicationModel';
import ResourceYAMLTab from '@utils/components/ResourceYAMLTab/ResourceYAMLTab';
import ApplicationHistoryTab from './ApplicationHistoryTab';
import EventsTab from '@utils/components/EventsTab/EventsTab';

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

  const [actions ] = useApplicationActionsProvider(application);

  const pages = React.useMemo(
    () => [
      {
        href: '',
        name: t('Details'),
        component: ApplicationDetailsTab,
      },
      {
        href: 'yaml',
        name: t('YAML'),
        component: ResourceYAMLTab,
      },
      {
        href: 'resources',
        name: t('Resources'),
        component: ApplicationResourcesTab,
      },
      {
        href: 'syncStatus',
        name: t('Sync Status'),
        component: ApplicationSyncStatusTab,
      },
      {
        href: 'History',
        name: t('History'),
        component: ApplicationHistoryTab,
      },
      {
        href: 'events',
        name: t('Events'),
        component: EventsTab,
      }
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
          <Spinner size='xl' />
        </Bullseye>
      )}
    </>
  );
};

export default ApplicationNavPage;
