import { modelToRef } from '@gitops-utils/utils';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

export const AppProjectModel: K8sModel = {
  label: 'AppProject',
  labelPlural: 'AppProjects',
  apiVersion: 'v1alpha1',
  apiGroup: 'argoproj.io',
  plural: 'appprojects',
  abbr: 'approj',
  namespaced: true,
  kind: 'AppProject',
  id: 'appproject',
  crd: true,
};

export type Destination = {
  name?: string,
  namespace: string,
  server: string
}

export type AppProjectKind = K8sResourceCommon & {
  spec?: {
    description?: string,
    destinations?: Destination[],
    sourceNamespaces?: string[],
    sourceRepos?: string[]
  };
  status?: { [key: string]: any };
};

export const appProjectModelRef = modelToRef(AppProjectModel);
