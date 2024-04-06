import * as React from 'react';

import {
  HorizontalNav,
  K8sResourceCommon,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';

import ProjectDetailsTab from './ProjectDetailsTab';
import ProjectYAMLTab from './ProjectYAMLTab';
import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import ProjectRolesTab from './ProjectRolesTab';
import ProjectWindowsTab from './ProjectWindowsTab';
import ProjectAppsTab from './ProjectAppsTab';
import PageTitle from '@utils/components/PageTitle/PageTitle';
import { AppProjectModel } from '@gitops-models/AppProjectModel';
import { useProjectActionsProvider } from './hooks/useProjectActionsProvider';

type ProjectPageProps = {
  name: string;
  namespace: string;
  kind: string;
};

const ProjectNavPage: React.FC<ProjectPageProps> = ({ name, namespace, kind }) => {
  const { t } = useGitOpsTranslation();
  const [appProject, loaded] = useK8sWatchResource<K8sResourceCommon>({
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'AppProject',
      version: 'v1alpha1',
    },
    kind,
    name,
    namespace,
  });

  const [actions /*, onLazyOpen*/] = useProjectActionsProvider(appProject);

  const pages = React.useMemo(
    () => [
      {
        href: '',
        name: t('Details'),
        component: ProjectDetailsTab,
      },
      {
        href: 'yaml',
        name: t('YAML'),
        component: ProjectYAMLTab,
      },
      {
        href: 'roles',
        name: t('Roles'),
        component: ProjectRolesTab,
      },
      {
        href: 'windows',
        name: t('Windows'),
        component: ProjectWindowsTab,
      },
      {
        href: 'applications',
        name: t('Applications'),
        component: ProjectAppsTab,
      },
    ],
    [],
  );

  return (
    <>
      <PageTitle obj={appProject} namespace={namespace} name={name} model={AppProjectModel} actions={actions} />
      {loaded ? (
        <HorizontalNav pages={pages} resource={appProject} />
      ) : (
        <Bullseye>
          <Spinner size='xl' />
        </Bullseye>
      )}
    </>
  );
};

export default ProjectNavPage;
