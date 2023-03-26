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

export type ApplicationSource = {
  chart: string,
  directory: {
    exclude?: string,
    include?: string,
    recurse?: boolean
  }
  helm: {
    releaseName?: string,
    version?: string
  }
  kustomize: {
    namePrefix?: string,
    nameSuffix?: string,
    version?: string
  }
  plugin?: {
    name: string
  }
  path?: string,
  ref?: string,
  repoURL?: string,
  targetRevision?: string
}

export type ApplicationSpec = {
  destination?: {
      namespace?: string,
      server?: string
  },
  project?: string,
  source?: ApplicationSource,
  sources?: ApplicationSource[]
}

export type ApplicationHistory = {
  deployStartedAt?: string,
  deployedAt?: string,
  id?: number,
  revision: string,
  source: ApplicationSource
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
  history?: ApplicationHistory[]
  reconciledAt?: string
  resources?: {
      kind: string,
      name: string,
      status?: string,
      version?: string
  }
  sourceType?: string
}

export type ApplicationKind = K8sResourceCommon & {
  spec?: ApplicationSpec,
  status?: ApplicationStatus
};

export const applicationModelRef = modelToRef(ApplicationModel);
