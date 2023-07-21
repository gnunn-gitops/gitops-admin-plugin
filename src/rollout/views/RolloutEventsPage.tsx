import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { ResourceEventStream } from '@openshift-console/dynamic-plugin-sdk';
import { PageSection, Title } from '@patternfly/react-core';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import { RolloutKind } from '../models/RolloutModel';

type RolloutEventsPageProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: RolloutKind;
};

const RolloutEventsPage: React.FC<RolloutEventsPageProps> = ({ obj: rollout }) => {
  const { t } = useGitOpsTranslation();
  return !rollout ? (
    <div>
      <PageSection>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Rollout details')}
        </Title>
      </PageSection>
    </div>
  ) : (
    <ResourceEventStream resource={rollout} />
  );
};

export default RolloutEventsPage;
