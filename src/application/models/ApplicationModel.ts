import { HealthStatus, PhaseStatus, SyncStatus } from '@gitops-utils/constants';
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

export type Retry = {
  limit?: number,
  backoff?: {
    duration?: string,
    factor?: number,
    maxDuration?: string
  }
}

export type SyncPolicy = {
  automated?: {
    selfHeal?: boolean,
    prune?: boolean,
    allowEmpty?: boolean,
  }
  retry?: Retry,
  syncOptions: string[]
}

export type ApplicationSpec = {
  destination?: {
      namespace?: string,
      server?: string
  },
  project?: string,
  source?: ApplicationSource,
  sources?: ApplicationSource[],
  syncPolicy?: SyncPolicy
}

export type ApplicationHistory = {
  deployStartedAt?: string,
  deployedAt?: string,
  id?: number,
  revision: string,
  source: ApplicationSource
}

export type Resource = {
  kind: string,
  group?: string,
  name: string,
  namespace?: string,
}

export type ApplicationResourceStatus = Resource & {
  hookPhase?: string,
  hookType?: string,
  message?: string;
  version?: string,
  syncWave?: number,
  status?: string
  health?: {
    status?: string,
    message?: string
  }
}

export type ApplicationCondition = {
  lastTransitionTime?: string,
  message?: string,
  type?: string
}

export type InitiatedBy = {
  username?: string,
  automated?: boolean
}

export type OperationState = {
  finishedAt?: string,
  message?: string,
  operation?: {
    initiatedBy?: InitiatedBy,
    retry?: {
      limit?: number
    }
    sync?: {
      revision: string
    }
  },
  phase?: PhaseStatus,
  startedAt?: string,
  syncResult?: {
    resources?: ApplicationResourceStatus[]
  }
}

export type CurrentSyncStatus = {
  revision?: string,
  status?: SyncStatus
}

export type ApplicationStatus = {
  conditions?: ApplicationCondition[],
  sync?: CurrentSyncStatus,
  health?: {
      status?: HealthStatus
  }
  history?: ApplicationHistory[],
  operationState?: OperationState,
  reconciledAt?: string
  resources?: ApplicationResourceStatus[];
  sourceType?: string
}

export type Info = {
  name: string,
  value: string
}

export type SyncOperation = {
  dryRun?: boolean,
  manifests?: string[],
  prune?: boolean,
  resources?: Resource[]
  revisions?: string[],
  source?: ApplicationSource,
  sources?: ApplicationSource[],
  syncOptions?: string[],
}

export type ApplicationOperation = {
  info?: Info[],
  initiatedBy?: InitiatedBy,
  retry?: Retry,
  sync?: SyncOperation
}

export type ApplicationKind = K8sResourceCommon & {
  spec?: ApplicationSpec,
  operation? : ApplicationOperation,
  status?: ApplicationStatus
};

export const applicationModelRef = modelToRef(ApplicationModel);