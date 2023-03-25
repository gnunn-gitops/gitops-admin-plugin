import { modelToRef } from '@gitops-utils/utils';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

export const ApplicationModel: K8sModel = {
  label: 'Application',
  labelPlural: 'Applications',
  apiVersion: 'v1alpha1',
  apiGroup: 'argoproj.io',
  plural: 'applications',
  abbr: 'app',
  namespaced: true,
  kind: 'Application',
  id: 'application',
  crd: true,
};

export type ApplicationSpec = {
  destination?: {
      namespace?: string,
      server?: string
  },
  project?: string,
  source?: {
      path?: string,
      repoURL?: string,
      targetRevision?: string
  }
}

export type SyncStatus = {
  revision?: string,
  status?: string
}

export type ApplicationStatus = {
  sync?: SyncStatus,
  health?: {
      status?: string
  }
}

export type ApplicationKind = K8sResourceCommon & {
  spec?: ApplicationSpec,
  status?: ApplicationStatus
};

export const applicationModelRef = modelToRef(ApplicationModel);
