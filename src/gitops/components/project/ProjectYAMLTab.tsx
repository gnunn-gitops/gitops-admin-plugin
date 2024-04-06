import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { AppProjectKind } from '@gitops-models/AppProjectModel';
import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import { PageSection, PageSectionVariants, Title } from '@patternfly/react-core';
import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';

type ProjectYAMLTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: AppProjectKind;
};

const ProjectYAMLTab: React.FC<ProjectYAMLTabProps> = ({ obj: appProject }) => {
  const { t } = useGitOpsTranslation();
  return !appProject ? (
    <div>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Project details')}
        </Title>
      </PageSection>
    </div>
  ) : (
    <ResourceYAMLEditor initialResource={appProject} header={'Project'} />
  );
};

export default ProjectYAMLTab;
