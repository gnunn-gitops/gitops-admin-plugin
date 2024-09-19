import * as React from 'react';

import {
  HorizontalNav,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';

import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import PageTitle from '@utils/components/PageTitle/PageTitle';
import { useCRActionsProvider } from './hooks/useCRActionsProvider';
import ResourceYAMLTab from '@utils/components/ResourceYAMLTab/ResourceYAMLTab';
import CRDetailsTab from './CRDetailsTab';
import { CertificateRequestKind, CertificateRequestModel } from '@cr-models/CertificateRequests';
import EventsTab from '@utils/components/EventsTab/EventsTab';

type CRPageProps = {
  name: string;
  namespace: string;
  kind: string;
};

const CRNavPage: React.FC<CRPageProps> = ({ name, namespace, kind }) => {
  const { t } = useGitOpsTranslation();
  const [cr, loaded] = useK8sWatchResource<CertificateRequestKind>({
    groupVersionKind: {
      group: 'cert-manager.io',
      kind: 'CertificateRequest',
      version: 'v1',
    },
    kind,
    name,
    namespace,
  });

  const [actions ] = useCRActionsProvider(cr);

  const pages = React.useMemo(
    () => [
      {
        href: '',
        name: t('Details'),
        component: CRDetailsTab,
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
      <PageTitle obj={cr} namespace={namespace} name={name} model={CertificateRequestModel} actions={actions} />
      {loaded ? (
        <HorizontalNav pages={pages} resource={cr} />
      ) : (
        <Bullseye>
          <Spinner size='xl' />
        </Bullseye>
      )}
    </>
  );
};

export default CRNavPage;
