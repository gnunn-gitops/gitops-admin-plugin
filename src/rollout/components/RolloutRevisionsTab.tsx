import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { PageSection, Title } from '@patternfly/react-core';
import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import { RolloutKind } from '../models/RolloutModel';
import { Revisions } from './Revisions/Revisions';
import { resourceAsArray } from '@gitops-utils/utils';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';

type RolloutRevisionsTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: RolloutKind;
};

const RolloutRevisionsTab: React.FC<RolloutRevisionsTabProps> = ({ obj: rollout }) => {
  const { t } = useGitOpsTranslation();

  const [replicaSets] = useK8sWatchResource({
    groupVersionKind: { group: 'apps', version: 'v1', kind: 'ReplicaSet' },
    isList: true,
    namespaced: true,
    namespace: rollout.metadata?.namespace,
    selector: rollout.spec.selector
  });

  return !rollout ? (
    <div>
      <PageSection>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Rollout details')}
        </Title>
      </PageSection>
    </div>
  ) : (
        <Revisions rollout={rollout} replicaSets={resourceAsArray(replicaSets)} />
  );
};

export default RolloutRevisionsTab;
