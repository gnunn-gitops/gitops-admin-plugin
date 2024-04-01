import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { ApplicationKind } from '@gitops-models/ApplicationModel';
import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import { PageSection, Title } from '@patternfly/react-core';
import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';

type ApplicationYAMLTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: ApplicationKind;
};

const ApplicationYAMLTab: React.FC<ApplicationYAMLTabProps> = ({ obj: application }) => {
  const { t } = useGitOpsTranslation();
  return !application ? (
    <div>
      <PageSection>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Application details')}
        </Title>
      </PageSection>
    </div>
  ) : (
    <ResourceYAMLEditor initialResource={application} header={'Application'} />
  );
};

export default ApplicationYAMLTab;
