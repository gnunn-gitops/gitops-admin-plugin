import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { AppProjectKind } from '@appproject-model';
import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import { PageSection, Title } from '@patternfly/react-core';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';

type AppProjectYAMLPageProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: AppProjectKind;
};

const AppProjectYAMLPage: React.FC<AppProjectYAMLPageProps> = ({ obj: appProject }) => {
  const { t } = useGitOpsTranslation();
  return !appProject ? (
    <div>
      <PageSection>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Project details')}
        </Title>
      </PageSection>
    </div>
  ) : (
    <ResourceYAMLEditor initialResource={appProject} header={'Project'} />
  );
};

export default AppProjectYAMLPage;
