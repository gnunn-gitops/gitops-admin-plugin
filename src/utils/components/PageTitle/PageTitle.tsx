import * as React from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_NAMESPACE } from '@gitops-utils/constants';
import { Breadcrumb, BreadcrumbItem, Spinner } from '@patternfly/react-core';
import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import { isApplicationRefreshing } from '@gitops-utils/gitops';
import { Action, K8sModel, K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import ActionDropDown from '../ActionDropDown/ActionDropDown';

type ApplicationPageTitleProps = {
  obj: K8sResourceCommon;
  model: K8sModel;
  name: string;
  namespace: string;
  actions: Action[];
};

const ApplicationPageTitle: React.FC<ApplicationPageTitleProps> = ({ obj, model, name, namespace, actions }) => {
  const { t } = useGitOpsTranslation();

  return (
    <>
      <div className="pf-c-page__main-breadcrumb">
        <Breadcrumb className="pf-c-breadcrumb co-breadcrumb">
          <BreadcrumbItem>
            <Link to={`/k8s/ns/${namespace || DEFAULT_NAMESPACE}/${model.apiGroup+"~"+model.apiVersion+"~"+model.kind}`}>
              {t(model.labelPlural)}
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>{t(model.labelPlural + ' Details')}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="co-m-nav-title co-m-nav-title--detail co-m-nav-title--breadcrumbs">
        <span className="co-m-pane__heading">
          <h1 className="co-m-pane__name co-resource-item">
            <span className="co-m-resource-icon co-m-resource-icon--lg">{'A'}</span>
            <span data-test-id="resource-title" className="co-resource-item__resource-name">
              {name ?? obj?.metadata?.name}{' '}{isApplicationRefreshing(obj) ? <Spinner size='md' /> : <span> </span>}
            </span>
          </h1>
          <div className="co-actions">
            <ActionDropDown actions={actions} isKebabToggle={false}/>
          </div>
        </span>
      </div>
    </>
  );
};

export default ApplicationPageTitle;
