import * as React from 'react';

import {
  HorizontalNav,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';

import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import PageTitle from '@utils/components/PageTitle/PageTitle';
import { useESActionsProvider } from './hooks/useESActionsProvider';
import ResourceYAMLTab from '@utils/components/ResourceYAMLTab/ResourceYAMLTab';
import ESDetailsTab from './ESDetailsTab';
import { ExternalSecretKind, ExternalSecretModel } from '@es-models/ExternalSecrets';
import EventsTab from '@utils/components/EventsTab/EventsTab';

type ESPageProps = {
  name: string;
  namespace: string;
  kind: string;
};

const ESNavPage: React.FC<ESPageProps> = ({ name, namespace, kind }) => {
  const { t } = useGitOpsTranslation();
  const [es, loaded] = useK8sWatchResource<ExternalSecretKind>({
    groupVersionKind: {
      group: 'external-secrets.io',
      kind: 'ExternalSecret',
      version: 'v1beta1',
    },
    kind,
    name,
    namespace,
  });

  const [actions ] = useESActionsProvider(es);

  const pages = React.useMemo(
    () => [
      {
        href: '',
        name: t('Details'),
        component: ESDetailsTab,
      },
      {
        href: 'yaml',
        name: t('YAML'),
        component: ResourceYAMLTab,
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
      <PageTitle obj={es} namespace={namespace} name={name} model={ExternalSecretModel} actions={actions} />
      {loaded ? (
        <HorizontalNav pages={pages} resource={es} />
      ) : (
        <Bullseye>
          <Spinner size='xl' />
        </Bullseye>
      )}
    </>
  );
};

export default ESNavPage;
