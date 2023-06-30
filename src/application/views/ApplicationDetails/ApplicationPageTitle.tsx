import * as React from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_NAMESPACE } from '@gitops-utils/constants';
import { Breadcrumb, BreadcrumbItem, Spinner } from '@patternfly/react-core';
import { ApplicationKind, applicationModelRef } from '../../models/ApplicationModel';
import { ApplicationActions } from '../components/ApplicationActions/ApplicationActions';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import { isApplicationRefreshing } from '@gitops-utils/gitops';

type ApplicationPageTitleProps = {
  application: ApplicationKind;
  name: string;
  namespace: string;
};

const ApplicationPageTitle: React.FC<ApplicationPageTitleProps> = ({ application, name, namespace }) => {
  const { t } = useGitOpsTranslation();
  return (
    <>
      <div className="pf-c-page__main-breadcrumb">
        <Breadcrumb className="pf-c-breadcrumb co-breadcrumb">
          <BreadcrumbItem>
            <Link to={`/k8s/ns/${namespace || DEFAULT_NAMESPACE}/${applicationModelRef}`}>
              {t('Applications')}
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>{t('Application Details')}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="co-m-nav-title co-m-nav-title--detail co-m-nav-title--breadcrumbs">
        <span className="co-m-pane__heading">
          <h1 className="co-m-pane__name co-resource-item">
            <span className="co-m-resource-icon co-m-resource-icon--lg">{'A'}</span>
            <span data-test-id="resource-title" className="co-resource-item__resource-name">
              {name ?? application?.metadata?.name}{' '}{isApplicationRefreshing(application) ? <Spinner isSVG size='md' /> : <span> </span>}
            </span>
          </h1>
          <div className="co-actions">
            <ApplicationActions application={application} />
          </div>
        </span>
      </div>
    </>
  );
};

export default ApplicationPageTitle;
