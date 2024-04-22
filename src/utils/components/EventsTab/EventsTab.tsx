import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { K8sResourceCommon, ResourceEventStream } from '@openshift-console/dynamic-plugin-sdk';
import { PageSection, Title } from '@patternfly/react-core';
import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';


type EventsTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: K8sResourceCommon;
};

const EventsTab: React.FC<EventsTabProps> = ({ obj }) => {
  const { t } = useGitOpsTranslation();
  return !obj ? (
    <div>
      <PageSection>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Rollout details')}
        </Title>
      </PageSection>
    </div>
  ) : (
    <ResourceEventStream resource={obj} />
  );
};

export default EventsTab;
