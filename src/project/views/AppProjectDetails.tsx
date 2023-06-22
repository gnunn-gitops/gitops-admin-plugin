import * as React from 'react';

import {
  HorizontalNav,
  K8sResourceCommon,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';

import AppProjectPageTitle from './AppProjectDetails/AppProjectPageTitle';
import AppProjectDetailsPage from './AppProjectDetailsPage';
import AppProjectYAMLPage from './AppProjectYAMLPage';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import AppProjectRolesPage from './AppProjectRolesPage';
import AppProjectWindowsPage from './AppProjectWindowsPage';

type AppProjectPageProps = {
  name: string;
  namespace: string;
  kind: string;
};

const AppProjectNavPage: React.FC<AppProjectPageProps> = ({ name, namespace, kind }) => {
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

  const pages = React.useMemo(
    () => [
      {
        href: '',
        name: t('Details'),
        component: AppProjectDetailsPage,
      },
      {
        href: 'yaml',
        name: t('YAML'),
        component: AppProjectYAMLPage,
      },
      {
        href: 'roles',
        name: t('Roles'),
        component: AppProjectRolesPage,
      },
      {
        href: 'windows',
        name: t('Windows'),
        component: AppProjectWindowsPage,
      },
      // {
      //   href: 'applications',
      //   name: t('Applications'),
      //   component: AppProjectAppsPage,
      // },
    ],
    [],
  );

  return (
    <>
      <AppProjectPageTitle appProject={appProject} namespace={namespace} name={name} />
      {loaded ? (
        <HorizontalNav pages={pages} resource={appProject} />
      ) : (
        <Bullseye>
          <Spinner isSVG size='xl' />
        </Bullseye>
      )}
    </>
  );
};

export default AppProjectNavPage;
