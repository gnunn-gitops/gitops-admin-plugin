import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { PageSection, Title } from '@patternfly/react-core';
import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import { RolloutKind } from '../models/RolloutModel';
import { PodList } from '@utils/components/PodList/PodList';

type RolloutPodsTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: RolloutKind;
};

const RolloutPodsTab: React.FC<RolloutPodsTabProps> = ({ obj: rollout }) => {
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
    <PodList namespace={rollout.metadata.namespace} selector={rollout.spec.selector}/>
  );
};

export default RolloutPodsTab;
