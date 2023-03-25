import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { ApplicationKind } from '@application-model';
import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import { PageSection, Title } from '@patternfly/react-core';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';

type ApplicationYAMLPageProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: ApplicationKind;
};

const ApplicationYAMLPage: React.FC<ApplicationYAMLPageProps> = ({ obj: application }) => {
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

export default ApplicationYAMLPage;
