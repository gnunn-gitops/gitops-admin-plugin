import * as React from 'react';

import {
  HorizontalNav,
  K8sResourceCommon,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';

import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import PageTitle from '@utils/components/PageTitle/PageTitle';
import { useRolloutActionsProvider } from './hooks/useRolloutActionsProvider';
import { RolloutModel } from '../models/RolloutModel';
import RolloutDetailsTab from './RolloutDetailsTab';
import RolloutEventsTab from './RolloutEventsTab';
import RolloutPodsTab from './RolloutPodsTab';
import ResourceYAMLTab from '@utils/components/ResourceYAMLTab/ResourceYAMLTab';

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
        component: RolloutDetailsTab,
      },
      {
        href: 'yaml',
        name: t('YAML'),
        component: ResourceYAMLTab,
      },
      {
        href: 'pods',
        name: t('Pods'),
        component: RolloutPodsTab,
      },
      {
        href: 'events',
        name: t('Events'),
        component: RolloutEventsTab,
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
          <Spinner />
        </Bullseye>
      )}
    </>
  );
};

export default RolloutNavPage;
