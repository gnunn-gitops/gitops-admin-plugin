import * as React from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_NAMESPACE } from '@gitops-utils/constants';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { AppProjectKind, appProjectModelRef } from '../../models/AppProjectModel';
import { AppProjectActions } from '../components/AppProjectActions/AppProjectActions';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';

type AppProjectPageTitleProps = {
  appProject: AppProjectKind;
  name: string;
  namespace: string;
};

const AppProjectPageTitle: React.FC<AppProjectPageTitleProps> = ({ appProject, name, namespace }) => {
  const { t } = useGitOpsTranslation();
  return (
    <>
      <div className="pf-c-page__main-breadcrumb">
        <Breadcrumb className="pf-c-breadcrumb co-breadcrumb">
          <BreadcrumbItem>
            <Link to={`/k8s/ns/${namespace || DEFAULT_NAMESPACE}/${appProjectModelRef}`}>
              {t('Projects')}
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>{t('Project Details')}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="co-m-nav-title co-m-nav-title--detail co-m-nav-title--breadcrumbs">
        <span className="co-m-pane__heading">
          <h1 className="co-m-pane__name co-resource-item">
            <span className="co-m-resource-icon co-m-resource-icon--lg">{'AP'}</span>
            <span data-test-id="resource-title" className="co-resource-item__resource-name">
              {name ?? appProject?.metadata?.name}{' '}
            </span>
          </h1>
          <div className="co-actions">
            <AppProjectActions appProject={appProject} />
          </div>
        </span>
      </div>
    </>
  );
};

export default AppProjectPageTitle;
