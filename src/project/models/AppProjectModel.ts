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

export type ResourceAllowDeny = {
  group: string,
  kind: string
}

export type Destination = {
  name?: string,
  namespace: string,
  server: string
}

export type Role = {
  name: string,
  description?: string,
  groups?: string[],
  policies?: string[]
}

export type SyncWindow = {
  kind: string,
  schedule: string,
  duration: string,
  applications?: string[],
  clusters?: string[],
  namespaces?: string[],
  manualSync?: boolean,
  timeZone?: string
}

export type AppProjectKind = K8sResourceCommon & {
  spec?: {
    description?: string,
    destinations?: Destination[],
    sourceNamespaces?: string[],
    sourceRepos?: string[],
    clusterResourceWhitelist?: ResourceAllowDeny[],
    clusterResourceBlacklist?: ResourceAllowDeny[],
    namespaceResourceWhitelist?: ResourceAllowDeny[],
    namespaceResourceBlacklist?: ResourceAllowDeny[],
    roles?: Role[],
    syncWindows: SyncWindow[]
  };
  status?: { [key: string]: any };
};

export const appProjectModelRef = modelToRef(AppProjectModel);
