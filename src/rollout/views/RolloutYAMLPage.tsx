import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import { PageSection, Title } from '@patternfly/react-core';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import { RolloutKind } from '../models/RolloutModel';

type RolloutYAMLPageProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: RolloutKind;
};

const RolloutYAMLPage: React.FC<RolloutYAMLPageProps> = ({ obj: rollout }) => {
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
    <ResourceYAMLEditor initialResource={rollout} header={'Rollout'} />
  );
};

export default RolloutYAMLPage;
