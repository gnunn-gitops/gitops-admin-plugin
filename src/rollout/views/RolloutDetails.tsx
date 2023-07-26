import * as React from 'react';

import {
  HorizontalNav,
  K8sResourceCommon,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';

import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import PageTitle from '@shared/views/components/PageTitle/PageTitle';
import { useRolloutActionsProvider } from './hooks/useRolloutActionsProvider';
import { RolloutModel } from '../models/RolloutModel';
import RolloutYAMLPage from './RolloutYAMLPage';
import RolloutDetailsPage from './RolloutDetailsPage';
import RolloutEventsPage from './RolloutEventsPage';
import RolloutPodsPage from './RolloutPodsPage';

type RolloutPageProps = {
  name: string;
  namespace: string;
  kind: string;
};

const RolloutNavPage: React.FC<RolloutPageProps> = ({ name, namespace, kind }) => {
  const { t } = useGitOpsTranslation();
  const [rollout, loaded] = useK8sWatchResource<K8sResourceCommon>({
    groupVersionKind: {
      group: RolloutModel.apiGroup,
      kind: RolloutModel.label,
      version: RolloutModel.apiVersion,
    },
    kind,
    name,
    namespace,
  });

  const [actions /*, onLazyOpen*/] = useRolloutActionsProvider(rollout);

  const pages = React.useMemo(
    () => [
      {
        href: '',
        name: t('Details'),
        component: RolloutDetailsPage,
      },
      {
        href: 'yaml',
        name: t('YAML'),
        component: RolloutYAMLPage,
      },
      {
        href: 'pods',
        name: t('Pods'),
        component: RolloutPodsPage,
      },
      {
        href: 'events',
        name: t('Events'),
        component: RolloutEventsPage,
      }
    ],
    [],
  );

  return (
    <>
      <PageTitle obj={rollout} namespace={namespace} name={name} model={RolloutModel} actions={actions} />
      {loaded ? (
        <HorizontalNav pages={pages} resource={rollout} />
      ) : (
        <Bullseye>
          <Spinner isSVG size='xl' />
        </Bullseye>
      )}
    </>
  );
};

export default RolloutNavPage;
