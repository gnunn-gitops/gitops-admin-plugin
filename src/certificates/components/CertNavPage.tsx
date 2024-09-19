import * as React from 'react';

import {
  HorizontalNav,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';

import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import PageTitle from '@utils/components/PageTitle/PageTitle';
import { useCertActionsProvider } from './hooks/useCertActionsProvider';
import ResourceYAMLTab from '@utils/components/ResourceYAMLTab/ResourceYAMLTab';
import CertDetailsTab from './CertDetailsTab';
import { CertificateKind, CertificateModel } from '@cert-models/Certificates';
import EventsTab from '@utils/components/EventsTab/EventsTab';

type CertPageProps = {
  name: string;
  namespace: string;
  kind: string;
};

const CertNavPage: React.FC<CertPageProps> = ({ name, namespace, kind }) => {
  const { t } = useGitOpsTranslation();
  const [cert, loaded] = useK8sWatchResource<CertificateKind>({
    groupVersionKind: {
      group: 'cert-manager.io',
      kind: 'Certificate',
      version: 'v1',
    },
    kind,
    name,
    namespace,
  });

  const [actions ] = useCertActionsProvider(cert);

  const pages = React.useMemo(
    () => [
      {
        href: '',
        name: t('Details'),
        component: CertDetailsTab,
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
      <PageTitle obj={cert} namespace={namespace} name={name} model={CertificateModel} actions={actions} />
      {loaded ? (
        <HorizontalNav pages={pages} resource={cert} />
      ) : (
        <Bullseye>
          <Spinner size='xl' />
        </Bullseye>
      )}
    </>
  );
};

export default CertNavPage;
