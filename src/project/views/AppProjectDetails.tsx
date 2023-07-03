import * as React from 'react';

import {
  HorizontalNav,
  K8sResourceCommon,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';

import AppProjectDetailsPage from './AppProjectDetailsPage';
import AppProjectYAMLPage from './AppProjectYAMLPage';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import AppProjectRolesPage from './AppProjectRolesPage';
import AppProjectWindowsPage from './AppProjectWindowsPage';
import AppProjectAppsPage from './AppProjectAppsPage';
import PageTitle from '@shared/views/components/PageTitle/PageTitle';
import { AppProjectModel } from '@appproject-model';
import { useAppProjectActionsProvider } from './hooks/useAppProjectActionsProvider';

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

  const [actions /*, onLazyOpen*/] = useAppProjectActionsProvider(appProject);

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
      {
        href: 'applications',
        name: t('Applications'),
        component: AppProjectAppsPage,
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
          <Spinner isSVG size='xl' />
        </Bullseye>
      )}
    </>
  );
};

export default AppProjectNavPage;
