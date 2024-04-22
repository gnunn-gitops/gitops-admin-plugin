import * as React from 'react';

import {
  HorizontalNav,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';

import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import PageTitle from '@utils/components/PageTitle/PageTitle';
import { useAppSetActionsProvider } from './hooks/useAppSetActionsProvider';
import { ApplicationSetKind, ApplicationSetModel } from '@gitops-models/ApplicationSetModel';
import ResourceYAMLTab from '@utils/components/ResourceYAMLTab/ResourceYAMLTab';
import AppSetDetailsTab from './AppSetDetailsTab';
import GeneratorsTab from './GeneratorsTab';
import AppsTab from './AppsTab';
import EventsTab from '@utils/components/EventsTab/EventsTab';

type AppSetPageProps = {
  name: string;
  namespace: string;
  kind: string;
};

const AppSetNavPage: React.FC<AppSetPageProps> = ({ name, namespace, kind }) => {
  const { t } = useGitOpsTranslation();
  const [appSet, loaded] = useK8sWatchResource<ApplicationSetKind>({
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'ApplicationSet',
      version: 'v1alpha1',
    },
    kind,
    name,
    namespace,
  });

  const [actions ] = useAppSetActionsProvider(appSet);

  const pages = React.useMemo(
    () => [
      {
        href: '',
        name: t('Details'),
        component: AppSetDetailsTab,
      },
      {
        href: 'yaml',
        name: t('YAML'),
        component: ResourceYAMLTab,
      },
      {
        href: 'generators',
        name: t('Generators'),
        component: GeneratorsTab,
      },
      {
        href: 'applications',
        name: t('Applications'),
        component: AppsTab,
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
      <PageTitle obj={appSet} namespace={namespace} name={name} model={ApplicationSetModel} actions={actions} />
      {loaded ? (
        <HorizontalNav pages={pages} resource={appSet} />
      ) : (
        <Bullseye>
          <Spinner size='xl' />
        </Bullseye>
      )}
    </>
  );
};

export default AppSetNavPage;
